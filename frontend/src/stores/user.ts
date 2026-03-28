import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, usersAPI } from '@/api'

interface User {
  id: string
  username: string
  email: string
  role: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEditor = computed(() => ['admin', 'editor'].includes(user.value?.role || ''))

  // Actions
  async function login(username: string, password: string) {
    loading.value = true
    try {
      const res = await authAPI.login({ username, password }) as any
      token.value = res.accessToken
      localStorage.setItem('token', res.accessToken)
      
      // Fetch user profile
      await fetchProfile()
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const res = await usersAPI.getById('me') as any
      user.value = res
      localStorage.setItem('user', JSON.stringify(res))
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Initialize from localStorage
  function init() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse saved user:', e)
      }
    }
  }

  init()

  return {
    token,
    user,
    loading,
    isLoggedIn,
    isAdmin,
    isEditor,
    login,
    logout,
    fetchProfile,
  }
})
