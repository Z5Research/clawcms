<template>
  <div class="contents-manage">
    <!-- 工具栏 -->
    <el-card class="toolbar">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <el-select v-model="filter.sectionId" placeholder="板块" clearable @change="loadContents" style="width: 150px">
            <el-option v-for="s in sections" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
          <el-select v-model="filter.isPublished" placeholder="状态" clearable @change="loadContents" style="width: 120px">
            <el-option label="已发布" :value="true" />
            <el-option label="草稿" :value="false" />
          </el-select>
        </div>
        <el-button type="primary" @click="showDialog()">
          <el-icon><Plus /></el-icon> 添加内容页
        </el-button>
      </div>
    </el-card>

    <!-- 内容页列表 -->
    <el-card>
      <el-table :data="contents" v-loading="loading">
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="slug" label="Slug" width="150" />
        <el-table-column prop="template" label="模板" width="100" />
        <el-table-column prop="isPublished" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isPublished ? 'success' : 'info'" size="small">
              {{ row.isPublished ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="60" />
        <el-table-column prop="updatedAt" label="更新时间" width="120">
          <template #default="{ row }">{{ formatDate(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="showDialog(row)">编辑</el-button>
            <el-button v-if="!row.isPublished" type="success" size="small" @click="publishContent(row.id)">发布</el-button>
            <el-button type="danger" size="small" @click="deleteContent(row.id)">删除</el-button>
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
          @current-change="loadContents"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑内容页' : '添加内容页'" width="700px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="form.slug" placeholder="URL 路径" />
        </el-form-item>
        <el-form-item label="模板">
          <el-select v-model="form.template" style="width: 100%">
            <el-option label="默认模板" value="default" />
            <el-option label="落地页" value="landing" />
            <el-option label="专题页" value="special" />
          </el-select>
        </el-form-item>
        <el-form-item label="Markdown">
          <el-input v-model="form.contentMarkdown" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="SEO标题">
          <el-input v-model="form.seoTitle" />
        </el-form-item>
        <el-form-item label="SEO描述">
          <el-input v-model="form.seoDescription" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="saveContent('draft')" :loading="saving">保存草稿</el-button>
        <el-button type="primary" @click="saveContent('publish')" :loading="saving">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { contentsAPI, sectionsAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const saving = ref(false)
const contents = ref<any[]>([])
const sections = ref<any[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const filter = reactive({ sectionId: '', isPublished: undefined as boolean | undefined })
const dialogVisible = ref(false)
const editingId = ref('')
const formRef = ref<FormInstance>()

const isEdit = computed(() => !!editingId.value)

const form = reactive({
  title: '',
  slug: '',
  template: 'default',
  contentMarkdown: '',
  seoTitle: '',
  seoDescription: ''
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入 Slug', trigger: 'blur' }]
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadContents = async () => {
  loading.value = true
  try {
    const res = await contentsAPI.getList({ page: page.value, limit, ...filter })
    contents.value = res?.data || []
    total.value = res?.meta?.total || 0
  } catch (e) {
    console.error('加载内容页失败', e)
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

const showDialog = (content?: any) => {
  editingId.value = content?.id || ''
  Object.assign(form, {
    title: content?.title || '',
    slug: content?.slug || '',
    template: content?.template || 'default',
    contentMarkdown: content?.contentMarkdown || '',
    seoTitle: content?.seoTitle || '',
    seoDescription: content?.seoDescription || ''
  })
  dialogVisible.value = true
}

const saveContent = async (mode: string) => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    const data = { ...form, isPublished: mode === 'publish' }
    if (isEdit.value) {
      await contentsAPI.update(editingId.value, data)
    } else {
      await contentsAPI.create(data)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadContents()
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const publishContent = async (id: string) => {
  try {
    await contentsAPI.publish(id)
    ElMessage.success('发布成功')
    loadContents()
  } catch (e) {
    ElMessage.error('发布失败')
  }
}

const deleteContent = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个内容页吗？', '提示', { type: 'warning' })
    await contentsAPI.delete(id)
    ElMessage.success('删除成功')
    loadContents()
  } catch (e) {
    // 取消删除
  }
}

onMounted(() => {
  loadContents()
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

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
