<template>
  <div class="users-manage">
    <!-- 工具栏 -->
    <el-card class="toolbar">
      <div class="toolbar-content">
        <el-input v-model="search" placeholder="搜索用户" clearable @input="loadUsers" style="width: 200px">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button type="primary" @click="showDialog()">
          <el-icon><Plus /></el-icon> 添加用户
        </el-button>
      </div>
    </el-card>

    <!-- 用户列表 -->
    <el-card>
      <el-table :data="users" v-loading="loading">
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="roleMap[row.role]">{{ roleText[row.role] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="120">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="showDialog(row)">编辑</el-button>
            <el-button v-if="row.isActive" type="warning" size="small" @click="toggleUser(row.id, false)">禁用</el-button>
            <el-button v-else type="success" size="small" @click="toggleUser(row.id, true)">启用</el-button>
            <el-button type="danger" size="small" @click="deleteUser(row.id)">删除</el-button>
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
          @current-change="loadUsers"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '添加用户'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="作者" value="author" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { usersAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const saving = ref(false)
const users = ref<any[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const search = ref('')
const dialogVisible = ref(false)
const editingId = ref('')
const formRef = ref<FormInstance>()

const isEdit = computed(() => !!editingId.value)

const form = reactive({
  username: '',
  password: '',
  email: '',
  role: 'author'
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const roleMap: Record<string, string> = { admin: 'danger', editor: 'warning', author: 'success' }
const roleText: Record<string, string> = { admin: '管理员', editor: '编辑', author: '作者' }

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await usersAPI.getList({ page: page.value, limit, search: search.value })
    users.value = res?.data || []
    total.value = res?.meta?.total || 0
  } catch (e) {
    console.error('加载用户失败', e)
  } finally {
    loading.value = false
  }
}

const showDialog = (user?: any) => {
  editingId.value = user?.id || ''
  Object.assign(form, {
    username: user?.username || '',
    password: '',
    email: user?.email || '',
    role: user?.role || 'author'
  })
  dialogVisible.value = true
}

const saveUser = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await usersAPI.update(editingId.value, form)
    } else {
      await usersAPI.create(form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadUsers()
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const toggleUser = async (id: string, active: boolean) => {
  try {
    await usersAPI.update(id, { isActive: active })
    ElMessage.success(active ? '已启用' : '已禁用')
    loadUsers()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const deleteUser = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个用户吗？', '提示', { type: 'warning' })
    await usersAPI.delete(id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (e) {
    // 取消删除
  }
}

onMounted(() => loadUsers())
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

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
