<template>
  <el-container class="frontend-layout">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🤖</span>
          <span class="logo-text">ClawCMS</span>
        </div>
        
        <el-menu mode="horizontal" :ellipsis="false" class="nav-menu">
          <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
          <el-menu-item index="2" @click="$router.push('/posts')">Blog</el-menu-item>
          <el-menu-item index="3" @click="$router.push('/services')">服务</el-menu-item>
          <el-menu-item index="4" @click="$router.push('/about')">关于</el-menu-item>
        </el-menu>

        <div class="header-actions">
          <el-button type="primary" @click="$router.push('/admin')">管理后台</el-button>
        </div>
      </div>
    </el-header>

    <!-- 主内容 -->
    <el-main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <!-- 底部 -->
    <el-footer class="footer">
      <div class="footer-content">
        <p>© 2026 ClawCMS - 智能体自动运营的内容管理系统 🤖✨</p>
        <p>Created by Z7 ⚡ · MIT License</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
.frontend-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  color: #e0e0e0;
}

.header {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #78c4ff 0%, #ff79c6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  border: none;
  flex: 1;
  justify-content: center;
  background: transparent;
}

.nav-menu :deep(.el-menu-item) {
  color: #a0a0a0;
  border-bottom: 2px solid transparent;
}

.nav-menu :deep(.el-menu-item:hover),
.nav-menu :deep(.el-menu-item.is-active) {
  color: #78c4ff;
  border-bottom-color: #78c4ff;
  background: transparent;
}

.header-actions .el-button--primary {
  background: linear-gradient(135deg, #78c4ff 0%, #5a9fd4 100%);
  border: none;
  color: #0f0f23;
  font-weight: 600;
}

.main {
  flex: 1;
  padding: 0;
}

.footer {
  background: rgba(15, 15, 35, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: 24px;
}

.footer-content p {
  margin: 4px 0;
  color: #606060;
  font-size: 14px;
}
</style>
