<template>
  <div class="permissions-page">
    <el-card>
      <template #header>
        <span>智能体权限配置</span>
      </template>

      <el-form label-width="120px">
        <el-form-item label="选择智能体">
          <el-select v-model="selectedAgentId" placeholder="选择智能体" @change="loadAgentPermissions">
            <el-option v-for="agent in agents" :key="agent.id" :label="agent.displayName" :value="agent.id" />
          </el-select>
        </el-form-item>

        <template v-if="selectedAgent">
          <el-form-item label="当前权限">
            <el-checkbox-group v-model="agentPermissions">
              <el-checkbox label="posts">文章操作</el-checkbox>
              <el-checkbox label="contents">内容页操作</el-checkbox>
              <el-checkbox label="comments">评论审核</el-checkbox>
              <el-checkbox label="media">媒体操作</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="允许板块">
            <el-select v-model="agentSections" multiple placeholder="留空表示所有板块" style="width: 300px">
              <el-option v-for="section in sections" :key="section.id" :label="section.name" :value="section.id" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="saveAgentPermissions" :loading="saving">保存权限配置</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>API 调用统计</span>
      </template>
      <el-table :data="agents" stripe>
        <el-table-column prop="displayName" label="智能体" width="150" />
        <el-table-column prop="requestCount" label="总调用次数" width="120" sortable />
        <el-table-column prop="lastRequestAt" label="最后调用时间" width="180">
          <template #default="{ row }">
            {{ row.lastRequestAt ? new Date(row.lastRequestAt).toLocaleString() : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">{{ row.isActive ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const agents = ref<any[]>([])
const sections = ref<any[]>([])
const selectedAgentId = ref('')
const agentPermissions = ref<string[]>([])
const agentSections = ref<string[]>([])
const saving = ref(false)

const API_BASE = '/api/v1'
const getToken = () => localStorage.getItem('token')

const selectedAgent = computed(() => agents.value.find(a => a.id === selectedAgentId.value))

const loadAgents = async () => {
  try {
    const res = await axios.get(`${API_BASE}/agents`, { headers: { Authorization: `Bearer ${getToken()}` } })
    agents.value = res.data
  } catch (e) {
    ElMessage.error('加载智能体失败')
  }
}

const loadSections = async () => {
  try {
    const res = await axios.get(`${API_BASE}/sections`, { headers: { Authorization: `Bearer ${getToken()}` } })
    sections.value = res.data
  } catch (e) {
    console.error('加载板块失败', e)
  }
}

const loadAgentPermissions = () => {
  if (selectedAgent.value) {
    agentPermissions.value = selectedAgent.value.permissions || []
    agentSections.value = selectedAgent.value.sections || []
  }
}

const saveAgentPermissions = async () => {
  saving.value = true
  try {
    await axios.put(`${API_BASE}/agents/${selectedAgentId.value}`, {
      permissions: agentPermissions.value,
      sections: agentSections.value,
    }, { headers: { Authorization: `Bearer ${getToken()}` } })
    ElMessage.success('保存成功')
    loadAgents()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadAgents()
  loadSections()
})
</script>
