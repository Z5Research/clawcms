// API 响应类型声明
// 由于 axios 拦截器返回 res.data，所有 API 方法返回的是 data 而非 AxiosResponse

declare module '@/api' {
  export interface ApiResponse<T = any> {
    data?: T
    meta?: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }

  export interface LoginResponse {
    user: any
    accessToken: string
    refreshToken: string
    expiresIn: number
  }

  export const authAPI: {
    login: (data: { username: string; password: string }) => Promise<LoginResponse>
    register: (data: any) => Promise<any>
    getProfile: () => Promise<any>
  }

  export const postsAPI: {
    getPublic: (params?: any) => Promise<ApiResponse>
    getList: (params?: any) => Promise<ApiResponse>
    getById: (id: string) => Promise<any>
    getBySlug: (slug: string) => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: string, data: any) => Promise<any>
    delete: (id: string) => Promise<any>
    publish: (id: string) => Promise<any>
  }

  export const sectionsAPI: {
    getList: (params?: any) => Promise<any[]>
    getById: (id: string) => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: string, data: any) => Promise<any>
    delete: (id: string) => Promise<any>
  }

  export const mediaAPI: {
    getList: (params?: any) => Promise<ApiResponse>
    upload: (file: File) => Promise<{ url: string }>
    delete: (id: string) => Promise<any>
  }

  export const usersAPI: {
    getList: (params?: any) => Promise<ApiResponse>
    getById: (id: string) => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: string, data: any) => Promise<any>
    delete: (id: string) => Promise<any>
  }

  export const commentsAPI: {
    getList: (params?: any) => Promise<ApiResponse>
    approve: (id: string) => Promise<any>
    reject: (id: string) => Promise<any>
    delete: (id: string) => Promise<any>
    bulkAudit: (data: { ids: string[]; status: string }) => Promise<any>
  }

  export const contentsAPI: {
    getList: (params?: any) => Promise<ApiResponse>
    getById: (id: string) => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: string, data: any) => Promise<any>
    delete: (id: string) => Promise<any>
    publish: (id: string) => Promise<any>
  }

  export const statsAPI: {
    getOverview: () => Promise<{
      coreMetrics?: {
        totalPosts: number
        publishedPosts: number
        totalContents: number
        totalComments: number
        pendingComments: number
        totalUsers: number
        totalSections: number
      }
      todayStats?: {
        views: number
        growth: string
      }
      quickActions?: {
        pendingComments: number
        draftPosts: number
        scheduledPosts: number
      }
      lastUpdated?: string
    }>
    getPosts: (params?: any) => Promise<any>
    getVisits: (params?: any) => Promise<any>
  }

  export const agentsAPI: {
    getList: (params?: any) => Promise<any>
    getById: (id: string) => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: string, data: any) => Promise<any>
    delete: (id: string) => Promise<any>
    resetKey: (id: string) => Promise<any>
    getGuide: (id: string) => Promise<any>
  }
}
