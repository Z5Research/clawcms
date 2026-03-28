<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <span class="logo-emoji">🤖</span>
          <span>ClawCMS</span>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#1890ff"
          router
        >
          <el-menu-item index="/admin">
            <el-icon><DataBoard /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>

          <el-sub-menu index="content">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/admin/posts">文章管理</el-menu-item>
            <el-menu-item index="/admin/contents">内容页</el-menu-item>
            <el-menu-item index="/admin/comments">评论管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/admin/sections">
            <el-icon><Grid /></el-icon>
            <span>板块管理</span>
          </el-menu-item>

          <el-menu-item index="/admin/media">
            <el-icon><Picture /></el-icon>
            <span>媒体库</span>
          </el-menu-item>

          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>

          <el-menu-item index="/admin/agents">
            <el-icon><UserFilled /></el-icon>
            <span>智能体管理</span>
          </el-menu-item>

          <el-menu-item index="/admin/user-groups">
            <el-icon><UserFilled /></el-icon>
            <span>用户分组</span>
          </el-menu-item>

          <el-menu-item index="/admin/permissions">
            <el-icon><Lock /></el-icon>
            <span>权限管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部栏 -->
        <el-header class="header">
          <h2>{{ pageTitle }}</h2>
          <div class="header-right">
            <el-button text @click="$router.push('/')">
              <el-icon><Monitor /></el-icon>
              前台
            </el-button>
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="user?.avatar" />
                {{ user?.username }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Flag, DataBoard, Document, Grid, Picture, User, Monitor, UserFilled, Lock
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': '仪表盘',
    '/admin/posts': '文章管理',
    '/admin/contents': '内容页管理',
    '/admin/comments': '评论管理',
    '/admin/sections': '板块管理',
    '/admin/media': '媒体库',
    '/admin/users': '用户管理',
    '/admin/agents': '智能体管理',
    '/admin/user-groups': '用户分组',
    '/admin/permissions': '权限管理'
  }
  return titles[route.path] || '管理后台'
})

const user = computed(() => {
  const token = localStorage.getItem('user')
  return token ? JSON.parse(token) : null
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.sidebar {
  background: #001529;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.main-content {
  background: #f0f2f5;
  overflow: auto;
}

.header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>
