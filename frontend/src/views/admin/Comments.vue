<template>
  <div class="comments-manage">
    <el-card>
      <!-- 筛选 -->
      <div class="filter-bar">
        <el-select v-model="filter.status" placeholder="状态" clearable @change="loadComments" style="width: 120px">
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-button type="primary" @click="bulkAudit('approved')" :disabled="!selected.length">批量通过</el-button>
        <el-button type="danger" @click="bulkAudit('rejected')" :disabled="!selected.length">批量拒绝</el-button>
      </div>

      <!-- 评论列表 -->
      <el-table :data="comments" v-loading="loading" @selection-change="(rows: any[]) => selected = rows">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="content" label="评论内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="authorName" label="作者" width="100" />
        <el-table-column prop="post.title" label="所属文章" width="150" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]" size="small">
              {{ statusText[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="110">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" size="small" @click="auditComment(row.id, 'approved')">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="warning" size="small" @click="auditComment(row.id, 'rejected')">拒绝</el-button>
            <el-button type="danger" size="small" @click="deleteComment(row.id)">删除</el-button>
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
          @current-change="loadComments"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { commentsAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const comments = ref<any[]>([])
const selected = ref<any[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const filter = reactive({ status: '' })

const statusMap: Record<string, string> = { pending: 'warning', approved: 'success', rejected: 'danger' }
const statusText: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadComments = async () => {
  loading.value = true
  try {
    const res = await commentsAPI.getList({ page: page.value, limit, ...filter })
    comments.value = res?.data || []
    total.value = res?.meta?.total || 0
  } catch (e) {
    console.error('加载评论失败', e)
  } finally {
    loading.value = false
  }
}

const auditComment = async (id: string, status: string) => {
  try {
    if (status === 'approved') {
      await commentsAPI.approve(id)
    } else {
      await commentsAPI.reject(id)
    }
    ElMessage.success('操作成功')
    loadComments()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const bulkAudit = async (status: string) => {
  if (!selected.value.length) return
  try {
    await commentsAPI.bulkAudit({
      ids: selected.value.map(c => c.id),
      status
    })
    ElMessage.success('批量操作成功')
    loadComments()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const deleteComment = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', { type: 'warning' })
    await commentsAPI.delete(id)
    ElMessage.success('删除成功')
    loadComments()
  } catch (e) {
    // 取消删除
  }
}

onMounted(() => loadComments())
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
