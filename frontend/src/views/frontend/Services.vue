<template>
  <div class="services-page">
    <div class="container">
      <div class="page-header">
        <h1>服务</h1>
        <p>ClawCMS 提供的智能内容运营服务</p>
      </div>

      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">🤖</div>
          <h2>智能体内容运营</h2>
          <p>AI 智能体 7x24 小时不间断内容运营，自动生成、发布、更新内容。</p>
          <ul>
            <li>新闻资讯自动发布</li>
            <li>行业数据报告生成</li>
            <li>多语种内容翻译</li>
            <li>内容自动审核</li>
          </ul>
          <div class="service-price">
            <span class="price">¥999</span>
            <span class="unit">/月起</span>
          </div>
        </div>

        <div class="service-card featured">
          <div class="featured-badge">推荐</div>
          <div class="service-icon">🚀</div>
          <h2>企业私有化部署</h2>
          <p>完整的企业级 ClawCMS 部署方案，支持定制开发和专属智能体。</p>
          <ul>
            <li>私有云/本地部署</li>
            <li>专属智能体定制</li>
            <li>API 接口对接</li>
            <li>技术支持服务</li>
          </ul>
          <div class="service-price">
            <span class="price">¥9,999</span>
            <span class="unit">一次性</span>
          </div>
        </div>

        <div class="service-card">
          <div class="service-icon">🎓</div>
          <h2>培训与咨询</h2>
          <p>专业的 AI 内容运营培训，帮助企业快速上手智能体运营。</p>
          <ul>
            <li>智能体配置培训</li>
            <li>内容策略咨询</li>
            <li>运营数据分析</li>
            <li>最佳实践分享</li>
          </ul>
          <div class="service-price">
            <span class="price">¥499</span>
            <span class="unit">/小时</span>
          </div>
        </div>
      </div>

      <div class="contact-section">
        <h2>联系我们</h2>
        <p>获取专属解决方案和报价</p>
        <div class="contact-info">
          <div class="contact-item">
            <span class="label">邮箱</span>
            <span class="value">contact@clawcms.ai</span>
          </div>
          <div class="contact-item">
            <span class="label">微信</span>
            <span class="value">ClawCMS</span>
          </div>
          <div class="contact-item">
            <span class="label">社区</span>
            <span class="value">discord.gg/clawd</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.services-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  color: #e0e0e0;
  padding: 80px 0;
}

.container {
  max-width: 1200px;
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 80px;
}

.service-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(120, 196, 255, 0.3);
}

.service-card.featured {
  border-color: rgba(120, 196, 255, 0.5);
  background: linear-gradient(135deg, rgba(120, 196, 255, 0.08) 0%, rgba(255, 121, 198, 0.08) 100%);
}

.featured-badge {
  position: absolute;
  top: -12px;
  right: 24px;
  background: linear-gradient(135deg, #78c4ff 0%, #ff79c6 100%);
  color: #0f0f23;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.service-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(120, 196, 255, 0.2) 0%, rgba(255, 121, 198, 0.2) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 20px;
}

.service-card h2 {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
}

.service-card p {
  color: #808080;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.service-card ul {
  list-style: none;
  margin-bottom: 24px;
}

.service-card li {
  padding: 8px 0;
  color: #a0a0a0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-left: 20px;
  position: relative;
}

.service-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #78c4ff;
}

.service-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.service-price .price {
  font-size: 32px;
  font-weight: 700;
  color: #78c4ff;
}

.service-price .unit {
  color: #606060;
  font-size: 14px;
}

.contact-section {
  text-align: center;
  padding: 60px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}

.contact-section h2 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.contact-section p {
  color: #808080;
  margin-bottom: 32px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 48px;
}

.contact-item {
  text-align: left;
}

.contact-item .label {
  display: block;
  font-size: 12px;
  color: #606060;
  margin-bottom: 4px;
}

.contact-item .value {
  font-size: 16px;
  color: #78c4ff;
  font-weight: 500;
}

@media (max-width: 968px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
