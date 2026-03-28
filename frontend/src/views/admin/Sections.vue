<template>
  <div class="sections-manage">
    <!-- 工具栏 -->
    <el-card class="toolbar">
      <el-button type="primary" @click="showDialog()">
        <el-icon><Plus /></el-icon> 添加板块
      </el-button>
    </el-card>

    <!-- 板块列表 -->
    <el-card>
      <el-table :data="sections" v-loading="loading" row-key="id">
        <el-table-column prop="name" label="板块名称" width="200" />
        <el-table-column prop="slug" label="Slug" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="color" label="颜色" width="80">
          <template #default="{ row }">
            <div class="color-preview" :style="{ background: row.color || 'var(--primary-color)' }" />
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="70" />
        <el-table-column prop="isActive" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'" size="small">
              {{ row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="showDialog(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteSection(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑板块' : '添加板块'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="form.slug" placeholder="URL 路径" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="图标名称" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="form.color" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSection" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { sectionsAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const saving = ref(false)
const sections = ref<any[]>([])
const dialogVisible = ref(false)
const editingId = ref('')
const formRef = ref<FormInstance>()

const isEdit = computed(() => !!editingId.value)

const form = reactive({
  name: '',
  slug: '',
  description: '',
  icon: 'Flag',
  color: '#0052d9',
  sortOrder: 0,
  isActive: true
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入 Slug', trigger: 'blur' }]
}

const loadSections = async () => {
  loading.value = true
  try {
    const res = await sectionsAPI.getList()
    sections.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error('加载板块失败', e)
  } finally {
    loading.value = false
  }
}

const showDialog = (section?: any) => {
  editingId.value = section?.id || ''
  Object.assign(form, {
    name: section?.name || '',
    slug: section?.slug || '',
    description: section?.description || '',
    icon: section?.icon || 'Flag',
    color: section?.color || '#0052d9',
    sortOrder: section?.sortOrder || 0,
    isActive: section?.isActive ?? true
  })
  dialogVisible.value = true
}

const saveSection = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await sectionsAPI.update(editingId.value, form)
    } else {
      await sectionsAPI.create(form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadSections()
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const deleteSection = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个板块吗？', '提示', { type: 'warning' })
    await sectionsAPI.delete(id)
    ElMessage.success('删除成功')
    loadSections()
  } catch (e) {
    // 取消删除
  }
}

onMounted(() => loadSections())
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}
</style>
