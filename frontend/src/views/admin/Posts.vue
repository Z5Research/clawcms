<template>
  <div class="posts-manage">
    <!-- 工具栏 -->
    <el-card class="toolbar">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <el-input v-model="search" placeholder="搜索文章" clearable @input="loadPosts" style="width: 200px">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-select v-model="filter.status" placeholder="状态" clearable @change="loadPosts" style="width: 120px">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
          <el-select v-model="filter.sectionId" placeholder="板块" clearable @change="loadPosts" style="width: 150px">
            <el-option v-for="s in sections" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </div>
        <el-button type="primary" @click="$router.push('/admin/posts/new')">
          <el-icon><Plus /></el-icon> 发布文章
        </el-button>
      </div>
    </el-card>

    <!-- 文章列表 -->
    <el-card>
      <el-table :data="posts" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <div class="post-title">
              <img v-if="row.featuredImage" :src="row.featuredImage" class="post-thumb" />
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="section.name" label="板块" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="阅读" width="70" />
        <el-table-column prop="publishedAt" label="发布时间" width="110">
          <template #default="{ row }">{{ formatDate(row.publishedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="$router.push(`/admin/posts/${row.id}/edit`)">编辑</el-button>
            <el-button v-if="row.status !== 'published'" type="success" size="small" @click="publishPost(row.id)">发布</el-button>
            <el-button type="danger" size="small" @click="deletePost(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          :page-size="limit"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="loadPosts"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { postsAPI, sectionsAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const posts = ref<any[]>([])
const sections = ref<any[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const search = ref('')
const filter = reactive({ status: '', sectionId: '' })

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadPosts = async () => {
  loading.value = true
  try {
    const res = await postsAPI.getList({ page: page.value, limit, ...filter })
    posts.value = res?.data || []
    total.value = res?.meta?.total || 0
  } catch (e) {
    console.error('加载文章失败', e)
  } finally {
    loading.value = false
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

const publishPost = async (id: string) => {
  try {
    await postsAPI.publish(id)
    ElMessage.success('发布成功')
    loadPosts()
  } catch (e) {
    ElMessage.error('发布失败')
  }
}

const deletePost = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', { type: 'warning' })
    await postsAPI.delete(id)
    ElMessage.success('删除成功')
    loadPosts()
  } catch (e) {
    // 取消删除
  }
}

onMounted(() => {
  loadPosts()
  loadSections()
})
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.post-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-thumb {
  width: 50px;
  height: 35px;
  object-fit: cover;
  border-radius: 4px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
