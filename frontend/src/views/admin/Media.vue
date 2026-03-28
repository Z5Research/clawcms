<template>
  <div class="media-manage">
    <!-- 工具栏 -->
    <el-card class="toolbar">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <el-radio-group v-model="viewMode">
            <el-radio-button label="grid">网格</el-radio-button>
            <el-radio-button label="list">列表</el-radio-button>
          </el-radio-group>
        </div>
        <el-upload
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleUpload"
          multiple
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon> 上传文件
          </el-button>
        </el-upload>
      </div>
    </el-card>

    <!-- 文件列表 -->
    <el-card>
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="media-grid">
        <div v-for="item in mediaList" :key="item.id" class="media-item" @click="previewItem = item">
          <img v-if="isImage(item)" :src="item.url" class="media-thumb" />
          <div v-else class="media-file">
            <el-icon :size="40"><Document /></el-icon>
            <span>{{ item.originalName }}</span>
          </div>
          <div class="media-name">{{ item.originalName }}</div>
          <div class="media-actions">
            <el-button size="small" @click.stop="copyUrl(item.url)">复制链接</el-button>
            <el-button type="danger" size="small" @click.stop="deleteMedia(item.id)">删除</el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <el-table v-else :data="mediaList" v-loading="loading">
        <el-table-column prop="originalName" label="文件名" min-width="200" />
        <el-table-column prop="mimeType" label="类型" width="120" />
        <el-table-column prop="size" label="大小" width="100">
          <template #default="{ row }">{{ formatSize(row.size) }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="上传时间" width="120">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="copyUrl(row.url)">复制</el-button>
            <el-button type="danger" size="small" @click="deleteMedia(row.id)">删除</el-button>
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
          @current-change="loadMedia"
        />
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="showPreview" title="文件预览" width="600px">
      <img v-if="previewItem && isImage(previewItem)" :src="previewItem.url" style="width: 100%" />
      <p v-else>{{ previewItem?.originalName }}</p>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mediaAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Document } from '@element-plus/icons-vue'
import type { UploadRequestOptions } from 'element-plus'

const loading = ref(false)
const mediaList = ref<any[]>([])
const page = ref(1)
const limit = 20
const total = ref(0)
const viewMode = ref('grid')
const previewItem = ref<any>(null)

const showPreview = computed(() => !!previewItem.value)

const isImage = (item: any) => item?.mimeType?.startsWith('image/')

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(1)} ${units[i]}`
}

const loadMedia = async () => {
  loading.value = true
  try {
    const res = await mediaAPI.getList({ page: page.value, limit })
    mediaList.value = res?.data || []
    total.value = res?.meta?.total || 0
  } catch (e) {
    console.error('加载媒体失败', e)
  } finally {
    loading.value = false
  }
}

const beforeUpload = (file: File) => {
  const isLt20M = file.size / 1024 / 1024 < 20
  if (!isLt20M) ElMessage.error('文件大小不能超过 20MB')
  return isLt20M
}

const handleUpload = async (options: UploadRequestOptions) => {
  try {
    await mediaAPI.upload(options.file as File)
    ElMessage.success('上传成功')
    loadMedia()
  } catch (e) {
    ElMessage.error('上传失败')
  }
}

const copyUrl = (url: string) => {
  navigator.clipboard.writeText(url)
  ElMessage.success('链接已复制')
}

const deleteMedia = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个文件吗？', '提示', { type: 'warning' })
    await mediaAPI.delete(id)
    ElMessage.success('删除成功')
    loadMedia()
  } catch (e) {
    // 取消删除
  }
}

onMounted(() => loadMedia())
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

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.media-item {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.media-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.media-thumb {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.media-file {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.media-file span {
  font-size: 12px;
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.media-name {
  margin-top: 8px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
