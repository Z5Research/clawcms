<template>
  <div class="about-page">
    <div class="container">
      <div class="page-header">
        <h1>关于 ClawCMS</h1>
        <p>让 AI 成为你的内容运营团队</p>
      </div>

      <div class="about-content">
        <section class="about-section">
          <h2>🎯 我们的愿景</h2>
          <p>
            ClawCMS 致力于让 AI 智能体成为内容运营的核心力量。我们相信，未来的内容生产将主要由 AI 完成，人类将专注于更有创造性的工作。
          </p>
          <p>
            通过 ClawCMS，企业可以实现真正的"无人值守"内容运营——AI 智能体自主生成、发布、更新内容，7x24 小时不间断运行。
          </p>
        </section>

        <section class="about-section">
          <h2>💡 核心优势</h2>
          <div class="advantages-grid">
            <div class="advantage-item">
              <div class="advantage-icon">🚀</div>
              <h3>效率革命</h3>
              <p>内容发布速度提升 60 倍，人力成本降低 80%</p>
            </div>
            <div class="advantage-item">
              <div class="advantage-icon">🤖</div>
              <h3>AI-First</h3>
              <p>API 设计优先考虑智能体使用场景</p>
            </div>
            <div class="advantage-item">
              <div class="advantage-icon">🔐</div>
              <h3>安全可靠</h3>
              <p>双重认证、权限隔离、自动署名</p>
            </div>
            <div class="advantage-item">
              <div class="advantage-icon">🔄</div>
              <h3>持续进化</h3>
              <p>开源社区驱动，功能持续迭代</p>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>📊 数据对比</h2>
          <div class="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>指标</th>
                  <th>传统方式</th>
                  <th>ClawCMS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>内容发布速度</td>
                  <td>30 分钟/篇</td>
                  <td class="highlight">30 秒/篇</td>
                </tr>
                <tr>
                  <td>人力成本</td>
                  <td>编辑团队</td>
                  <td class="highlight">智能体</td>
                </tr>
                <tr>
                  <td>更新频率</td>
                  <td>日更</td>
                  <td class="highlight">实时更新</td>
                </tr>
                <tr>
                  <td>错误率</td>
                  <td>人工校对</td>
                  <td class="highlight">AI 审核</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="about-section">
          <h2>🛠️ 技术栈</h2>
          <div class="tech-stack">
            <div class="tech-item">
              <span class="tech-icon">⚡</span>
              <span class="tech-name">NestJS</span>
              <span class="tech-desc">后端框架</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">💚</span>
              <span class="tech-name">Vue 3</span>
              <span class="tech-desc">前端框架</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">📦</span>
              <span class="tech-name">SQLite</span>
              <span class="tech-desc">数据库</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">🎨</span>
              <span class="tech-name">Element Plus</span>
              <span class="tech-desc">UI 组件</span>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>📜 开源协议</h2>
          <p>
            ClawCMS 采用 <strong>MIT License</strong> 开源协议，您可以自由使用、修改、分发。
          </p>
          <div class="license-box">
            <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software...</p>
          </div>
        </section>

        <section class="about-section">
          <h2>📞 联系我们</h2>
          <div class="contact-grid">
            <a href="https://github.com/Z5Research/clawcms" class="contact-item">
              <span class="contact-icon">🐙</span>
              <span class="contact-label">GitHub</span>
              <span class="contact-value">Z5Research/clawcms</span>
            </a>
            <a href="#" class="contact-item">
              <span class="contact-icon">📖</span>
              <span class="contact-label">文档</span>
              <span class="contact-value">docs.clawcms.ai</span>
            </a>
            <a href="#" class="contact-item">
              <span class="contact-icon">💬</span>
              <span class="contact-label">社区</span>
              <span class="contact-value">discord.gg/clawd</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  color: #e0e0e0;
  padding: 80px 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #a0d0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #808080;
  font-size: 18px;
}

.about-section {
  margin-bottom: 60px;
}

.about-section h2 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.about-section p {
  color: #a0a0a0;
  line-height: 1.8;
  margin-bottom: 16px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.advantage-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
}

.advantage-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.advantage-item h3 {
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 8px;
}

.advantage-item p {
  color: #808080;
  font-size: 14px;
  margin: 0;
}

.comparison-table {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.comparison-table th {
  background: rgba(120, 196, 255, 0.1);
  color: #78c4ff;
  font-weight: 600;
}

.comparison-table .highlight {
  color: #78c4ff;
  font-weight: 600;
}

.tech-stack {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px 24px;
}

.tech-icon {
  font-size: 24px;
}

.tech-name {
  font-weight: 600;
  color: #ffffff;
}

.tech-desc {
  color: #606060;
  font-size: 14px;
}

.license-box {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  font-family: monospace;
  font-size: 13px;
  color: #808080;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  text-decoration: none;
  transition: all 0.3s;
}

.contact-item:hover {
  border-color: rgba(120, 196, 255, 0.3);
  transform: translateY(-4px);
}

.contact-icon {
  font-size: 32px;
}

.contact-label {
  color: #606060;
  font-size: 12px;
}

.contact-value {
  color: #78c4ff;
  font-weight: 500;
}

@media (max-width: 768px) {
  .advantages-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-stack {
    flex-direction: column;
  }
}
</style>
