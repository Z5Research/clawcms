<template>
  <div class="agents-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>智能体管理</span>
          <el-button type="primary" @click="showCreateDialog">
            <el-icon><Plus /></el-icon>
            创建智能体
          </el-button>
        </div>
      </template>

      <el-table :data="agents" v-loading="loading" stripe>
        <el-table-column prop="displayName" label="名称" width="150" />
        <el-table-column prop="name" label="标识" width="120" />
        <el-table-column prop="apiKey" label="API Key" width="280">
          <template #default="{ row }">
            <code class="api-key">{{ row.apiKey }}</code>
            <el-button text size="small" @click="copyKey(row.apiKey)">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="permissions" label="权限" width="150">
          <template #default="{ row }">
            <el-tag v-for="p in row.permissions" :key="p" size="small" class="mr-1">
              {{ p }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requestCount" label="调用次数" width="100" />
        <el-table-column prop="isActive" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button text size="small" @click="viewGuide(row)">
              <el-icon><Document /></el-icon>
              文档
            </el-button>
            <el-button text size="small" @click="regenerateKey(row)">
              <el-icon><Refresh /></el-icon>
              重置Key
            </el-button>
            <el-button text size="small" type="danger" @click="deleteAgent(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建对话框 -->
    <el-dialog v-model="createVisible" title="创建智能体" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="如 z9 (英文标识)" />
        </el-form-item>
        <el-form-item label="显示名" prop="displayName">
          <el-input v-model="form.displayName" placeholder="如 Z9 智能体" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox label="posts">文章</el-checkbox>
            <el-checkbox label="contents">内容页</el-checkbox>
            <el-checkbox label="comments">评论</el-checkbox>
            <el-checkbox label="media">媒体</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="createAgent" :loading="creating">
          创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 创建成功对话框 -->
    <el-dialog v-model="successVisible" title="智能体创建成功" width="600px">
      <el-alert type="success" :closable="false" class="mb-4">
        智能体创建成功！请保存以下信息，API Secret 仅显示一次。
      </el-alert>
      
      <div class="key-info">
        <p><strong>API Key:</strong></p>
        <code class="api-key">{{ createdAgent?.apiKey }}</code>
        <el-button text @click="copyKey(createdAgent?.apiKey)">
          <el-icon><CopyDocument /></el-icon>
        </el-button>
      </div>
      
      <div class="key-info">
        <p><strong>API Secret:</strong></p>
        <code class="api-key">{{ createdAgent?.apiSecret }}</code>
        <el-button text @click="copyKey(createdAgent?.apiSecret)">
          <el-icon><CopyDocument /></el-icon>
        </el-button>
      </div>

      <div class="guide-link">
        <p><strong>在线文档:</strong></p>
        <a :href="guideUrl" target="_blank">{{ guideUrl }}</a>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, CopyDocument, Document, Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const creating = ref(false)
const createVisible = ref(false)
const successVisible = ref(false)
const agents = ref<any[]>([])
const createdAgent = ref<any>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  displayName: '',
  description: '',
  permissions: ['posts']
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { pattern: /^[a-z0-9_]+$/, message: '只能包含小写字母、数字和下划线', trigger: 'blur' }
  ],
  displayName: [{ required: true, message: '请输入显示名', trigger: 'blur' }]
}

const API_BASE = '/api/v1'
const getToken = () => localStorage.getItem('token')

const guideUrl = computed(() => {
  if (!createdAgent.value) return ''
  return `${API_BASE}/agents/${createdAgent.value.id}/guide.md`
})

const loadAgents = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE}/agents`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    agents.value = res.data
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  Object.assign(form, {
    name: '',
    displayName: '',
    description: '',
    permissions: ['posts']
  })
  createVisible.value = true
}

const createAgent = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  creating.value = true
  try {
    const res = await axios.post(`${API_BASE}/agents`, form, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    createdAgent.value = res.data
    createVisible.value = false
    successVisible.value = true
    loadAgents()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '创建失败')
  } finally {
    creating.value = false
  }
}

const copyKey = (text?: string) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  ElMessage.success('已复制')
}

const viewGuide = (agent: any) => {
  window.open(`${API_BASE}/agents/${agent.id}/guide.md`, '_blank')
}

const regenerateKey = async (agent: any) => {
  try {
    await ElMessageBox.confirm('重新生成后，原 API Key 将失效，确定继续？', '提示', {
      type: 'warning'
    })
    await axios.post(`${API_BASE}/agents/${agent.id}/regenerate-key`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    ElMessage.success('Key 已重新生成')
    loadAgents()
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const deleteAgent = async (agent: any) => {
  try {
    await ElMessageBox.confirm(`确定删除智能体 ${agent.displayName}？`, '提示', {
      type: 'warning'
    })
    await axios.delete(`${API_BASE}/agents/${agent.id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    ElMessage.success('删除成功')
    loadAgents()
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadAgents()
})
</script>

<style scoped>
.agents-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.api-key {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.mr-1 {
  margin-right: 4px;
}

.mb-4 {
  margin-bottom: 16px;
}

.key-info {
  margin-bottom: 16px;
}

.key-info p {
  margin: 0 0 8px;
}

.guide-link {
  margin-top: 16px;
}

.guide-link a {
  color: #1890ff;
}
</style>
