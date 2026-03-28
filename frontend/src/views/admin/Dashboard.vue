<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="24" class="stat-cards">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #409eff">
            <el-icon :size="24"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.posts }}</div>
            <div class="stat-label">文章总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #67c23a">
            <el-icon :size="24"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.users }}</div>
            <div class="stat-label">注册用户</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #e6a23c">
            <el-icon :size="24"><ChatDotRound /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.comments }}</div>
            <div class="stat-label">评论数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #f56c6c">
            <el-icon :size="24"><View /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.views }}</div>
            <div class="stat-label">总访问量</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="quick-actions">
      <template #header>
        <span>快捷操作</span>
      </template>
      <div class="actions-grid">
        <el-button type="primary" @click="$router.push('/admin/posts/new')">
          <el-icon><Plus /></el-icon> 发布文章
        </el-button>
        <el-button @click="$router.push('/admin/sections')">
          <el-icon><Grid /></el-icon> 管理板块
        </el-button>
        <el-button @click="$router.push('/admin/media')">
          <el-icon><Upload /></el-icon> 上传媒体
        </el-button>
        <el-button @click="$router.push('/admin/users')">
          <el-icon><UserFilled /></el-icon> 添加用户
        </el-button>
      </div>
    </el-card>

    <!-- 最近文章 -->
    <el-card class="recent-posts">
      <template #header>
        <div class="card-header">
          <span>最近文章</span>
          <el-button text @click="$router.push('/admin/posts')">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentPosts" v-loading="loading">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="阅读" width="80" />
        <el-table-column prop="publishedAt" label="发布时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.publishedAt) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 待审评论 -->
    <el-card class="pending-comments">
      <template #header>
        <div class="card-header">
          <span>待审评论</span>
          <el-button text @click="$router.push('/admin/comments')">查看全部</el-button>
        </div>
      </template>
      <el-table :data="pendingComments" v-loading="loading">
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="authorName" label="作者" width="100" />
        <el-table-column prop="createdAt" label="时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="approveComment(row.id)">通过</el-button>
            <el-button type="danger" size="small" @click="rejectComment(row.id)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { postsAPI, commentsAPI, statsAPI } from '@/api'
import { ElMessage } from 'element-plus'
import { Document, User, ChatDotRound, View, Plus, Grid, Upload, UserFilled } from '@element-plus/icons-vue'

const loading = ref(false)
const stats = reactive({ posts: 0, users: 0, comments: 0, views: 0 })
const recentPosts = ref<any[]>([])
const pendingComments = ref<any[]>([])

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadStats = async () => {
  try {
    const res: any = await statsAPI.getOverview()
    // 处理后端返回的嵌套数据结构
    if (res.coreMetrics) {
      stats.posts = res.coreMetrics.publishedPosts || 0
      stats.users = res.coreMetrics.totalUsers || 0
      stats.comments = res.coreMetrics.totalComments || 0
      stats.views = res.todayStats?.views || 0
    } else {
      Object.assign(stats, res)
    }
  } catch (e) {
    console.error('加载统计失败', e)
  }
}

const loadRecentPosts = async () => {
  try {
    const res = await postsAPI.getList({ limit: 5 })
    recentPosts.value = res?.data || []
  } catch (e) {
    console.error('加载文章失败', e)
  }
}

const loadPendingComments = async () => {
  try {
    const res = await commentsAPI.getList({ status: 'pending', limit: 5 })
    pendingComments.value = res?.data || []
  } catch (e) {
    console.error('加载评论失败', e)
  }
}

const approveComment = async (id: string) => {
  try {
    await commentsAPI.approve(id)
    ElMessage.success('已通过')
    loadPendingComments()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const rejectComment = async (id: string) => {
  try {
    await commentsAPI.reject(id)
    ElMessage.success('已拒绝')
    loadPendingComments()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loading.value = true
  Promise.all([loadStats(), loadRecentPosts(), loadPendingComments()]).finally(() => {
    loading.value = false
  })
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.stat-cards {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-num {
  font-size: 28px;
  font-weight: bold;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.quick-actions {
  margin-bottom: 24px;
}

.actions-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-posts, .pending-comments {
  margin-bottom: 24px;
}
</style>
