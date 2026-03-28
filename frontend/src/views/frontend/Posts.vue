<template>
  <div class="posts-page">
    <div class="page-header">
      <h1>文章列表</h1>
      <p>体育旅游产业资讯与深度分析</p>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-bar">
      <el-select v-model="filter.sectionId" placeholder="选择板块" clearable @change="loadPosts" style="width: 200px">
        <el-option v-for="s in sections" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
      <el-input
        v-model="filter.search"
        placeholder="搜索文章..."
        clearable
        @keyup.enter="loadPosts"
        @clear="loadPosts"
        style="width: 300px; margin-left: 16px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="loadPosts">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 文章列表 -->
    <div v-if="posts.length" class="posts-list">
      <el-card v-for="post in posts" :key="post.id" class="post-card" @click="$router.push(`/posts/${post.slug}`)">
        <div class="post-main">
          <img v-if="post.featuredImage" :src="post.featuredImage" class="post-image" />
          <div class="post-content">
            <h2>{{ post.title }}</h2>
            <p>{{ post.excerpt }}</p>
            <div class="post-meta">
              <el-tag v-if="post.section?.name" size="small">{{ post.section.name }}</el-tag>
              <span>{{ formatDate(post.publishedAt) }}</span>
              <span>{{ post.viewCount }} 阅读</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-empty v-else description="暂无文章" />

    <!-- 分页 -->
    <div v-if="total > 0" class="pagination">
      <el-pagination
        v-model:current-page="page"
        :page-size="limit"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadPosts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { postsAPI, sectionsAPI } from '@/api'

const route = useRoute()
const posts = ref<any[]>([])
const sections = ref<any[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const filter = ref({ sectionId: '', search: '' })

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadPosts = async () => {
  try {
    const res = await postsAPI.getPublic({ 
      page: page.value, 
      limit, 
      sectionId: filter.value.sectionId,
      search: filter.value.search
    })
    posts.value = res?.data || []
    total.value = res?.meta?.total || 0
  } catch (e) {
    console.error('加载文章失败', e)
  }
}

const loadSections = async () => {
  try {
    const res = await sectionsAPI.getList()
    sections.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error('加载板块失败', e)
  }
}

onMounted(() => {
  // 从 URL 参数读取搜索词
  if (route.query.search) {
    filter.value.search = route.query.search as string
  }
  loadPosts()
  loadSections()
})
</script>

<style scoped>
.posts-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-secondary);
}

.filter-bar {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  cursor: pointer;
  transition: all 0.3s;
}

.post-card:hover {
  transform: translateX(4px);
  border-left: 4px solid var(--primary-color);
}

.post-main {
  display: flex;
  gap: 20px;
}

.post-image {
  width: 200px;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.post-content {
  flex: 1;
}

.post-content h2 {
  font-size: 18px;
  margin-bottom: 8px;
}

.post-content p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.post-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  color: var(--text-secondary);
  font-size: 12px;
}

.pagination {
  margin-top: 32px;
  text-align: center;
}
</style>
