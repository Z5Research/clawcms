<template>
  <div class="post-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑文章' : '发布新文章' }}</span>
          <div class="header-actions">
            <el-button @click="saveDraft" :loading="saving">保存草稿</el-button>
            <el-button type="primary" @click="publish" :loading="saving">发布</el-button>
          </div>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="板块" prop="sectionId">
              <el-select v-model="form.sectionId" placeholder="选择板块" style="width: 100%">
                <el-option v-for="s in sections" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签">
              <el-select v-model="form.tags" multiple placeholder="选择标签" style="width: 100%">
                <el-option v-for="t in tags" :key="t.id" :label="t.name" :value="t.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="摘要">
          <el-input v-model="form.excerpt" type="textarea" :rows="2" placeholder="文章摘要" />
        </el-form-item>

        <el-form-item label="封面">
          <el-upload
            class="cover-uploader"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadCover"
          >
            <img v-if="form.featuredImage" :src="form.featuredImage" class="cover-image" />
            <el-icon v-else class="cover-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="15" placeholder="支持 Markdown 格式" />
        </el-form-item>

        <el-form-item label="SEO标题">
          <el-input v-model="form.seoTitle" placeholder="SEO 标题（可选）" />
        </el-form-item>

        <el-form-item label="SEO描述">
          <el-input v-model="form.seoDescription" type="textarea" :rows="2" placeholder="SEO 描述（可选）" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postsAPI, sectionsAPI, mediaAPI } from '@/api'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const saving = ref(false)
const sections = ref<any[]>([])
const tags = ref<any[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  slug: '',
  sectionId: '',
  tags: [] as string[],
  excerpt: '',
  content: '',
  featuredImage: '',
  seoTitle: '',
  seoDescription: ''
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  sectionId: [{ required: true, message: '请选择板块', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const loadSections = async () => {
  try {
    const res = await sectionsAPI.getList()
    sections.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error('加载板块失败', e)
  }
}

const loadPost = async () => {
  if (!isEdit.value) return
  try {
    const res = await postsAPI.getById(route.params.id as string)
    Object.assign(form, res)
  } catch (e) {
    ElMessage.error('加载文章失败')
    router.push('/admin/posts')
  }
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) ElMessage.error('只能上传图片文件')
  if (!isLt5M) ElMessage.error('图片大小不能超过 5MB')
  return isImage && isLt5M
}

const uploadCover = async (options: UploadRequestOptions) => {
  try {
    const res = await mediaAPI.upload(options.file as File)
    form.featuredImage = res.url
  } catch (e) {
    ElMessage.error('上传失败')
  }
}

const saveDraft = async () => {
  await savePost('draft')
}

const publish = async () => {
  await savePost('published')
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) || `post-${Date.now()}`
}

const savePost = async (status: string) => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    const data = { 
      ...form, 
      status,
      slug: form.slug || generateSlug(form.title)
    }
    if (isEdit.value) {
      await postsAPI.update(route.params.id as string, data)
    } else {
      await postsAPI.create(data)
    }
    ElMessage.success(status === 'published' ? '发布成功' : '保存成功')
    router.push('/admin/posts')
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '操作失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSections()
  loadPost()
})
</script>

<style scoped>
.post-edit {
  max-width: 900px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-uploader:hover {
  border-color: var(--primary-color);
}

.cover-image {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.cover-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
