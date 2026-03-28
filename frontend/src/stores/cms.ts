import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsAPI, sectionsAPI, commentsAPI, statsAPI } from '@/api'

export const useCMSStore = defineStore('cms', () => {
  // State
  const sections = ref<any[]>([])
  const stats = ref<any>(null)
  const recentPosts = ref<any[]>([])
  const pendingComments = ref(0)
  const loading = ref(false)

  // Getters
  const sectionOptions = computed(() => 
    sections.value.map(s => ({ label: s.name, value: s.id }))
  )

  // Actions
  async function fetchSections() {
    try {
      const res = await sectionsAPI.getList()
      sections.value = Array.isArray(res) ? res : []
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    }
  }

  async function fetchStats() {
    try {
      const res = await statsAPI.getOverview() as any
      stats.value = res
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  async function fetchRecentPosts() {
    try {
      const res = await postsAPI.getList({ limit: 10 }) as any
      recentPosts.value = res?.data || res || []
    } catch (error) {
      console.error('Failed to fetch recent posts:', error)
    }
  }

  async function fetchPendingComments() {
    try {
      const res = await commentsAPI.getList({ status: 'pending', limit: 1 }) as any
      pendingComments.value = res?.meta?.total || 0
    } catch (error) {
      console.error('Failed to fetch pending comments:', error)
    }
  }

  async function initDashboard() {
    loading.value = true
    try {
      await Promise.all([
        fetchStats(),
        fetchRecentPosts(),
        fetchPendingComments(),
      ])
    } finally {
      loading.value = false
    }
  }

  return {
    sections,
    stats,
    recentPosts,
    pendingComments,
    loading,
    sectionOptions,
    fetchSections,
    fetchStats,
    fetchRecentPosts,
    fetchPendingComments,
    initDashboard,
  }
})
