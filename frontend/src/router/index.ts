import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 前台页面
  {
    path: '/',
    component: () => import('@/views/frontend/Layout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/frontend/Home.vue') },
      { path: 'posts', name: 'Posts', component: () => import('@/views/frontend/Posts.vue') },
      { path: 'posts/:slug', name: 'PostDetail', component: () => import('@/views/frontend/PostDetail.vue') },
      { path: 'sections', name: 'Sections', component: () => import('@/views/frontend/Sections.vue') },
      { path: 'services', name: 'Services', component: () => import('@/views/frontend/Services.vue') },
      { path: 'about', name: 'About', component: () => import('@/views/frontend/About.vue') }
    ]
  },
  // 管理后台
  {
    path: '/admin',
    component: () => import('@/views/admin/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'posts', name: 'AdminPosts', component: () => import('@/views/admin/Posts.vue') },
      { path: 'posts/new', name: 'AdminPostNew', component: () => import('@/views/admin/PostEdit.vue') },
      { path: 'posts/:id/edit', name: 'AdminPostEdit', component: () => import('@/views/admin/PostEdit.vue') },
      { path: 'comments', name: 'AdminComments', component: () => import('@/views/admin/Comments.vue') },
      { path: 'media', name: 'AdminMedia', component: () => import('@/views/admin/Media.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/Users.vue') },
      { path: 'contents', name: 'AdminContents', component: () => import('@/views/admin/Contents.vue') },
      { path: 'sections', name: 'AdminSections', component: () => import('@/views/admin/Sections.vue') },
      { path: 'agents', name: 'AdminAgents', component: () => import('@/views/admin/Agents.vue') },
      { path: 'user-groups', name: 'AdminUserGroups', component: () => import('@/views/admin/UserGroups.vue') },
      { path: 'permissions', name: 'AdminPermissions', component: () => import('@/views/admin/Permissions.vue') }
    ]
  },
  // 登录
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
