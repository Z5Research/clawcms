<template>
  <div class="user-groups-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户分组管理</span>
          <el-button type="primary" @click="showCreateDialog">
            <el-icon><Plus /></el-icon>
            创建分组
          </el-button>
        </div>
      </template>

      <el-table :data="groups" v-loading="loading" stripe>
        <el-table-column prop="displayName" label="分组名称" width="120" />
        <el-table-column prop="name" label="标识" width="100" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="level" label="权限级别" width="100" sortable />
        <el-table-column prop="users" label="用户数" width="80">
          <template #default="{ row }">
            {{ row.users?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button text size="small" @click="showEditDialog(row)">编辑</el-button>
            <el-button text size="small" type="danger" @click="deleteGroup(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="editing ? '编辑分组' : '创建分组'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标识" prop="name" v-if="!editing">
          <el-input v-model="form.name" placeholder="如 editor" />
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="form.displayName" placeholder="如 编辑" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="权限级别">
          <el-input-number v-model="form.level" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="权限列表">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox label="posts">文章</el-checkbox>
            <el-checkbox label="contents">内容页</el-checkbox>
            <el-checkbox label="comments">评论</el-checkbox>
            <el-checkbox label="media">媒体</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGroup" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const editing = ref(false)
const groups = ref<any[]>([])
const currentId = ref('')
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  displayName: '',
  description: '',
  permissions: [] as string[],
  level: 50,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入标识', trigger: 'blur' }],
  displayName: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
}

const API_BASE = '/api/v1'
const getToken = () => localStorage.getItem('token')

const loadGroups = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE}/user-groups`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    groups.value = res.data
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  editing.value = false
  Object.assign(form, { name: '', displayName: '', description: '', permissions: [], level: 50 })
  dialogVisible.value = true
}

const showEditDialog = (group: any) => {
  editing.value = true
  currentId.value = group.id
  Object.assign(form, {
    name: group.name,
    displayName: group.displayName,
    description: group.description,
    permissions: group.permissions || [],
    level: group.level,
  })
  dialogVisible.value = true
}

const saveGroup = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    if (editing.value) {
      await axios.put(`${API_BASE}/user-groups/${currentId.value}`, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
    } else {
      await axios.post(`${API_BASE}/user-groups`, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadGroups()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const deleteGroup = async (group: any) => {
  try {
    await ElMessageBox.confirm(`确定删除分组 ${group.displayName}？`, '提示', { type: 'warning' })
    await axios.delete(`${API_BASE}/user-groups/${group.id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    ElMessage.success('删除成功')
    loadGroups()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e?.response?.data?.message || '删除失败')
  }
}

onMounted(() => loadGroups())
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
