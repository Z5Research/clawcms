<template>
  <div class="sections-page">
    <div class="page-header">
      <h1>内容板块</h1>
      <p>聚焦体育旅游核心领域</p>
    </div>

    <div v-if="sections.length" class="sections-grid">
      <el-card v-for="section in sections" :key="section.id" class="section-card">
        <div class="section-icon" :style="{ background: section.color || 'var(--primary-color)' }">
          <el-icon :size="40"><component :is="getIcon(section.icon)" /></el-icon>
        </div>
        <h2>{{ section.name }}</h2>
        <p>{{ section.description }}</p>
        <div class="section-stats">
          <span>{{ section.postCount || 0 }} 篇文章</span>
        </div>
      </el-card>
    </div>
    <el-empty v-else description="暂无板块" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sectionsAPI } from '@/api'
import { Flag, Location, Trophy, DataAnalysis, Guide } from '@element-plus/icons-vue'

const sections = ref<any[]>([])
const iconMap: Record<string, any> = { Flag, Location, Trophy, DataAnalysis, Guide }
const getIcon = (icon?: string) => iconMap[icon || 'Flag'] || Flag

onMounted(async () => {
  try {
    const res = await sectionsAPI.getList()
    sections.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error('加载板块失败', e)
  }
})
</script>

<style scoped>
.sections-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-secondary);
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.section-card {
  text-align: center;
  padding: 24px;
}

.section-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #fff;
}

.section-card h2 {
  font-size: 20px;
  margin-bottom: 12px;
}

.section-card p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.section-stats {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
