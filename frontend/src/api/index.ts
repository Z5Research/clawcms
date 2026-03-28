import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000
})

// 请求拦截
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || '请求失败'
    ElMessage.error(msg)
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// 认证
export const authAPI = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/users/me')
}

// 导出默认 api
export default api

// 文章
export const postsAPI = {
  getPublic: (params?: any) => api.get('/posts/public', { params }),
  getList: (params?: any) => api.get('/posts', { params }),
  getById: (id: string) => api.get(`/posts/${id}`),
  getBySlug: (slug: string) => api.get(`/posts/slug/${slug}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  publish: (id: string) => api.post(`/posts/${id}/publish`)
}

// 板块
export const sectionsAPI = {
  getList: () => api.get('/sections'),
  getById: (id: string) => api.get(`/sections/${id}`),
  create: (data: any) => api.post('/sections', data),
  update: (id: string, data: any) => api.put(`/sections/${id}`, data),
  delete: (id: string) => api.delete(`/sections/${id}`),
  updateOrder: (data: any) => api.put('/sections/order', data)
}

// 内容页
export const contentsAPI = {
  getList: (params?: any) => api.get('/contents', { params }),
  getById: (id: string) => api.get(`/contents/${id}`),
  create: (data: any) => api.post('/contents', data),
  update: (id: string, data: any) => api.put(`/contents/${id}`, data),
  delete: (id: string) => api.delete(`/contents/${id}`),
  publish: (id: string) => api.post(`/contents/${id}/publish`)
}

// 评论
export const commentsAPI = {
  getList: (params?: any) => api.get('/comments', { params }),
  approve: (id: string) => api.put(`/comments/${id}/approve`),
  reject: (id: string) => api.put(`/comments/${id}/reject`),
  delete: (id: string) => api.delete(`/comments/${id}`),
  bulkAudit: (data: any) => api.post('/comments/bulk-audit', data)
}

// 用户
export const usersAPI = {
  getList: (params?: any) => api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),
  delete: (id: string) => api.delete(`/users/${id}`)
}

// 媒体
export const mediaAPI = {
  getList: (params?: any) => api.get('/media', { params }),
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id: string) => api.delete(`/media/${id}`)
}

// 统计
export const statsAPI = {
  getOverview: () => api.get('/stats/overview'),
  getPosts: (params?: any) => api.get('/stats/posts', { params }),
  getVisits: (params?: any) => api.get('/stats/visits', { params })
}

// AI
export const aiAPI = {
  publish: (data: any) => api.post('/ai/publish', data),
  generateContent: (data: any) => api.post('/ai/contents/generate', data),
  auditComments: (data: any) => api.post('/ai/comments/audit', data)
}
