<template>
  <div class="post-detail" v-if="post">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/posts' }">文章</el-breadcrumb-item>
      <el-breadcrumb-item v-if="post.section" :to="{ path: `/sections/${post.section.slug}` }">{{ post.section.name }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ post.title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="post-header">
        <el-tag v-if="post.section?.name">{{ post.section.name }}</el-tag>
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span>{{ formatDate(post.publishedAt) }}</span>
          <span>{{ post.viewCount }} 阅读</span>
          <span v-if="post.authorName">作者：{{ post.authorName }}</span>
        </div>
      </div>

      <img v-if="post.featuredImage" :src="post.featuredImage" class="featured-image" />

      <div class="post-content" v-html="renderedContent"></div>
    </el-card>

    <!-- 相关文章 -->
    <div class="related-posts" v-if="relatedPosts.length">
      <h2>相关文章</h2>
      <div class="related-list">
        <el-card v-for="p in relatedPosts" :key="p.id" class="related-card" @click="goToPost(p.slug)">
          <h3>{{ p.title }}</h3>
          <p>{{ formatDate(p.publishedAt) }}</p>
        </el-card>
      </div>
    </div>
  </div>
  <el-empty v-else-if="!loading" description="文章不存在" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postsAPI } from '@/api'
import { marked } from 'marked'

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

const route = useRoute()
const router = useRouter()
const post = ref<any>(null)
const relatedPosts = ref<any[]>([])
const loading = ref(true)

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked.parse(post.value.content) as string
})

const goToPost = (slug: string) => {
  router.push(`/posts/${slug}`)
}

onMounted(async () => {
  try {
    const res = await postsAPI.getBySlug(route.params.slug as string)
    post.value = res
  } catch (e) {
    console.error('加载文章失败', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 12px 0;
}

.post-header {
  text-align: center;
  margin-bottom: 24px;
}

.post-header h1 {
  font-size: 28px;
  margin: 16px 0;
}

.post-meta {
  display: flex;
  gap: 24px;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.featured-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 24px;
}

.post-content {
  line-height: 1.8;
  font-size: 16px;
}

.post-content :deep(h1), .post-content :deep(h2), .post-content :deep(h3) {
  margin: 24px 0 12px;
}

.post-content :deep(pre) {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.post-content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
}

.post-content :deep(ul), .post-content :deep(ol) {
  padding-left: 24px;
  margin: 12px 0;
}

.post-content :deep(blockquote) {
  border-left: 4px solid #1a56db;
  padding-left: 16px;
  margin: 16px 0;
  color: #666;
}

.post-content :deep(a) {
  color: #1a56db;
  text-decoration: none;
}

.post-content :deep(a:hover) {
  text-decoration: underline;
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.post-content :deep(th), .post-content :deep(td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.post-content :deep(th) {
  background: #f5f5f5;
}

.related-posts {
  margin-top: 40px;
}

.related-posts h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.related-card {
  cursor: pointer;
}

.related-card h3 {
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-card p {
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
