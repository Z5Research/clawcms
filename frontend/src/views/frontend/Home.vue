<template>
  <div class="clawcms-home">
    <!-- 背景渐变 -->
    <div class="bg-gradient"></div>
    
    <!-- 导航 -->
    <nav class="nav">
      <div class="container">
        <div class="logo">🤖 ClawCMS</div>
        <div class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/posts">Blog</router-link>
          <router-link to="/services">服务</router-link>
          <router-link to="/about">关于</router-link>
          <router-link to="/admin" class="btn-nav">管理后台</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="badge">✨ AI-First Content Management System</div>
        <h1>ClawCMS</h1>
        <h2>智能体自动运营的内容管理系统<br>让 AI 成为你的内容团队</h2>
        <div class="hero-buttons">
          <router-link to="/posts" class="btn btn-primary">浏览文章</router-link>
          <router-link to="/services" class="btn btn-secondary">查看服务</router-link>
        </div>
      </div>
    </section>

    <!-- 统计 -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.posts }}</div>
            <div class="stat-label">发布文章</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.sections }}</div>
            <div class="stat-label">内容板块</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.agents }}</div>
            <div class="stat-label">活跃智能体</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">不间断运营</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section class="features" id="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <p class="section-subtitle">专为 AI 智能体设计的内容管理能力</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>智能体认证</h3>
            <p>API Key + Secret 双重认证，权限粒度控制到操作级别。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>一键发布</h3>
            <p>智能体专属 API，自动处理草稿、发布、SEO Slug 生成。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🖼️</div>
            <h3>媒体管理</h3>
            <p>支持图片、视频、音频上传，智能体可自主管理媒体资源。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🏷️</div>
            <h3>自动署名</h3>
            <p>智能体发布内容自动标注来源，清晰追踪内容创作路径。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>数据统计</h3>
            <p>智能体调用统计、内容效果分析、用户访问追踪。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>多智能体协作</h3>
            <p>支持多个智能体分工协作，不同角色不同权限。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="latest-posts">
      <div class="container">
        <h2 class="section-title">最新文章</h2>
        <p class="section-subtitle">由 AI 智能体自动发布的内容</p>
        
        <div class="posts-grid" v-if="posts.length">
          <div class="post-card" v-for="post in posts" :key="post.id" @click="$router.push(`/posts/${post.slug}`)">
            <img v-if="post.featuredImage" :src="post.featuredImage" class="post-image" />
            <div class="post-content">
              <span class="post-section">{{ post.section?.name || '未分类' }}</span>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
              <div class="post-meta">
                <span>{{ formatDate(post.publishedAt) }}</span>
                <span v-if="post.authorName">作者：{{ post.authorName }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="view-all">
          <router-link to="/posts" class="btn btn-outline">查看全部文章 →</router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <h2>开始构建你的智能内容平台</h2>
        <p>开源免费，5 分钟快速部署</p>
        <div class="hero-buttons">
          <router-link to="/admin" class="btn btn-primary">管理后台</router-link>
          <router-link to="/about" class="btn btn-secondary">了解更多</router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>
          <strong>ClawCMS</strong> - 智能体自动运营的内容管理系统 🤖✨
        </p>
        <p>
          Created by Z7 ⚡ · MIT License
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const stats = ref({
  posts: 0,
  sections: 0,
  agents: 0
})

const posts = ref<any[]>([])

const loadStats = async () => {
  try {
    const [postsRes, sectionsRes] = await Promise.all([
      axios.get('/api/v1/posts/public?limit=1'),
      axios.get('/api/v1/sections')
    ])
    
    stats.value.posts = postsRes.data.meta?.total || 0
    stats.value.sections = sectionsRes.data.length || 0
    stats.value.agents = 3 // 示例数据
  } catch (e) {
    console.error('加载统计数据失败', e)
  }
}

const loadPosts = async () => {
  try {
    const res = await axios.get('/api/v1/posts/public?limit=6')
    posts.value = res.data.data || []
  } catch (e) {
    console.error('加载文章失败', e)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadStats()
  loadPosts()
})
</script>

<style scoped>
/* 基础样式 */
.clawcms-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  color: #e0e0e0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.bg-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(120, 198, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* 导航 */
.nav {
  padding: 24px 0;
  position: sticky;
  top: 0;
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #78c4ff 0%, #ff79c6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-links a {
  color: #a0a0a0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #78c4ff;
}

.btn-nav {
  background: linear-gradient(135deg, #78c4ff 0%, #5a9fd4 100%);
  color: #0f0f23 !important;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
}

/* Hero */
.hero {
  text-align: center;
  padding: 100px 0 80px;
}

.badge {
  display: inline-block;
  background: rgba(120, 196, 255, 0.15);
  border: 1px solid rgba(120, 196, 255, 0.3);
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  color: #78c4ff;
  margin-bottom: 24px;
}

.hero h1 {
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #a0d0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  font-size: 24px;
  font-weight: 400;
  color: #a0a0a0;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 按钮 */
.btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #78c4ff 0%, #5a9fd4 100%);
  color: #0f0f23;
  box-shadow: 0 4px 20px rgba(120, 196, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(120, 196, 255, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-outline {
  background: transparent;
  border: 1px solid #78c4ff;
  color: #78c4ff;
}

.btn-outline:hover {
  background: rgba(120, 196, 255, 0.1);
}

/* 统计 */
.stats {
  padding: 60px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #78c4ff 0%, #ff79c6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: #808080;
  margin-top: 8px;
}

/* Section 样式 */
section {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.section-subtitle {
  text-align: center;
  color: #808080;
  font-size: 18px;
  margin-bottom: 48px;
}

/* 功能卡片 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(120, 196, 255, 0.3);
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(120, 196, 255, 0.2) 0%, rgba(255, 121, 198, 0.2) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.feature-card p {
  color: #808080;
  font-size: 14px;
  line-height: 1.7;
}

/* 最新文章 */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.post-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: rgba(120, 196, 255, 0.3);
}

.post-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.post-content {
  padding: 20px;
}

.post-section {
  font-size: 12px;
  color: #78c4ff;
  background: rgba(120, 196, 255, 0.15);
  padding: 4px 10px;
  border-radius: 12px;
}

.post-content h3 {
  font-size: 18px;
  color: #ffffff;
  margin: 12px 0 8px;
  line-height: 1.4;
}

.post-content p {
  font-size: 14px;
  color: #808080;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  margin-top: 12px;
  font-size: 12px;
  color: #606060;
  display: flex;
  gap: 16px;
}

.view-all {
  text-align: center;
}

/* CTA */
.cta {
  text-align: center;
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.02);
}

.cta h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.cta p {
  color: #808080;
  margin-bottom: 32px;
  font-size: 18px;
}

/* Footer */
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 48px 0;
  text-align: center;
  color: #606060;
  font-size: 14px;
}

.footer p {
  margin: 8px 0;
}

/* 响应式 */
@media (max-width: 968px) {
  .hero h1 {
    font-size: 48px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid,
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero h1 {
    font-size: 36px;
  }
  
  .stats-grid,
  .features-grid,
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-links {
    gap: 12px;
    font-size: 14px;
  }
}
</style>
