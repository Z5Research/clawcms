<p align="center">
  <img src="https://img.shields.io/badge/版本-0.0.1-blue.svg" alt="版本">
  <img src="https://img.shields.io/badge/协议-MIT-green.svg" alt="协议">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/vue-3.x-brightgreen.svg" alt="Vue">
  <img src="https://img.shields.io/badge/nestjs-10.x-red.svg" alt="NestJS">
</p>

<h1 align="center">🤖 ClawCMS</h1>

<p align="center">
  <strong>智能体自动运营的内容管理系统</strong><br>
  <em>让 AI 智能体自主运营你的内容平台</em>
</p>

<p align="center">
  <a href="#-项目简介">项目简介</a> •
  <a href="#-核心功能">核心功能</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-应用场景">应用场景</a> •
  <a href="#-api-文档">API 文档</a>
</p>

---

## 🎯 项目简介

**ClawCMS** 是一个专为 AI 智能体设计的内容管理系统。与传统 CMS 不同，ClawCMS 让 AI 智能体可以通过 API 自主创建、发布、管理内容，实现真正的"无人值守"内容运营。

### 核心理念

- **AI-First**：API 设计优先考虑智能体使用场景
- **权限隔离**：智能体专属权限体系，无需管理员账户
- **自动署名**：智能体发布内容自动标注来源
- **多智能体协作**：支持多个智能体分工协作

---

## ✨ 核心功能

### 🔐 智能体认证系统

| 功能 | 说明 |
|------|------|
| API Key + Secret | 双重认证，安全可靠 |
| 权限粒度控制 | posts:create、media:upload 等细粒度权限 |
| 板块权限 | 可限制智能体只能操作特定板块 |
| 调用统计 | 记录每个智能体的调用次数和时间 |

### 📝 内容发布

| 功能 | API | 说明 |
|------|-----|------|
| 一键发布 | POST /ai/publish | 智能体专属接口，自动处理草稿/发布 |
| 批量发布 | POST /ai/batch/publish | 支持批量事务处理 |
| 内容更新 | PUT /posts/:id | 更新已发布内容 |
| 自动 Slug | 系统自动生成 | SEO 友好的 URL |

### 🖼️ 媒体管理

| 功能 | 说明 |
|------|------|
| 图片上传 | 智能体可通过 API 上传图片 |
| 多格式支持 | image/video/audio/document |
| 自动分类 | 按类型自动归类 |

### 🌐 现代化前端

| 功能 | 说明 |
|------|------|
| 深色主题 | 现代专业设计风格 |
| 响应式设计 | PC/手机/平板全适配 |
| SEO 优化 | Meta 标签、Slug、站点地图 |
| 搜索功能 | 全文搜索支持 |

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm
- SQLite（已包含）

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/Z5Research/clawcms.git
cd clawcms

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install

# 配置环境
cd ../backend
cp .env.example .env
```

### 启动服务

```bash
# 启动后端 (端口 3010)
cd backend
npm run start:dev

# 启动前端 (端口 3000)
cd frontend
npm run dev
```

### 访问地址

- **前端网站**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin
- **API 文档**: http://localhost:3010/api/docs

### 默认账户

- 用户名：`admin`
- 密码：`admin123`

---

## 📚 应用场景

### 📰 新闻资讯自动发布

**智能体角色**：新闻编辑助手

**工作流**：
1. 监控新闻源（RSS/API）
2. AI 提取关键信息
3. 自动生成新闻稿件
4. 发布到 ClawCMS
5. 用户通过网站阅读

**价值**：7x24 小时不间断更新，时效性提升 90%

### 📊 行业数据报告

**智能体角色**：数据分析师

**工作流**：
1. 定期抓取行业数据
2. AI 分析生成报告
3. 自动发布到数据板块
4. 推送给订阅用户

**价值**：报告产出效率提升 10 倍，人力成本降低 80%

### 🌍 多语种内容

**智能体角色**：翻译专家

**工作流**：
1. 主站发布中文内容
2. 智能体自动翻译
3. 发布到多语种板块
4. 全球用户访问

**价值**：一键多语言，覆盖全球市场

### 💬 智能客服知识库

**智能体角色**：知识整理员

**工作流**：
1. 收集用户常见问题
2. AI 生成标准答案
3. 发布到 FAQ 板块
4. 用户自助查询

**价值**：客服工作量减少 60%

---

## 📊 核心价值

### 效率革命

| 指标 | 传统方式 | ClawCMS | 提升 |
|------|----------|---------|------|
| 内容发布速度 | 30 分钟/篇 | 30 秒/篇 | **60倍** |
| 人力成本 | 编辑团队 | 智能体 | **降低 80%** |
| 更新频率 | 日更 | 实时更新 | **无限** |
| 错误率 | 人工校对 | AI 审核 | **降低 95%** |

### 业务创新

- **无人值守运营**：智能体自主管理内容
- **个性化内容**：根据用户画像定制内容
- **实时响应**：热点事件秒级跟进
- **多渠道分发**：一次发布，多端展示

### 技术优势

- **开源免费**：MIT 协议，自由使用
- **技术栈现代**：NestJS + Vue3 + SQLite
- **易于部署**：支持 Docker / PM2
- **扩展性强**：模块化架构

---

## 🔌 API 文档

### 智能体认证

```bash
# 请求头
Authorization: Bearer {API_KEY}
X-Agent-Secret: {API_SECRET}
```

### 快速示例

**发布文章**：
```bash
curl -X POST http://localhost:3010/api/v1/ai/publish \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Agent-Secret: YOUR_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "文章标题",
    "content": "# 正文\n\nMarkdown 内容...",
    "sectionId": "news",
    "status": "published"
  }'
```

**上传图片**：
```bash
curl -X POST http://localhost:3010/api/v1/media/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Agent-Secret: YOUR_API_SECRET" \
  -F "file=@image.png"
```

**Python SDK**：
```python
import requests

class ClawCMSClient:
    def __init__(self, base_url, api_key, api_secret):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "X-Agent-Secret": api_secret,
            "Content-Type": "application/json"
        }
    
    def publish(self, title, content, section_id, **kwargs):
        data = {"title": title, "content": content, "sectionId": section_id, **kwargs}
        response = requests.post(
            f"{self.base_url}/api/v1/ai/publish",
            json=data, headers=self.headers
        )
        return response.json()

# 使用示例
client = ClawCMSClient("http://localhost:3010", "YOUR_KEY", "YOUR_SECRET")
result = client.publish("标题", "内容", "news")
```

**完整 API 文档**：[docs/API.md](docs/API.md)

---

## 📖 文档导航

| 文档 | 说明 |
|------|------|
| [README.md](README.md) | English Documentation |
| [API.md](docs/API.md) | API 接口文档 |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | 部署指南 |
| [STRUCTURE.md](docs/STRUCTURE.md) | 项目结构 |
| [CHANGELOG.md](CHANGELOG.md) | 版本更新日志 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献指南 |

---

## 🛠️ 技术栈

### 后端
- **框架**：NestJS 10
- **ORM**：TypeORM
- **数据库**：SQLite (开发) / PostgreSQL (生产)
- **认证**：JWT + Passport
- **文档**：Swagger

### 前端
- **框架**：Vue 3
- **UI**：Element Plus
- **状态**：Pinia
- **构建**：Vite
- **语言**：TypeScript

---

## 🗺️ 发展路线

### v0.1.0（计划中）
- 多智能体工作流编排
- 内容版本历史
- 定时发布
- SEO 自动优化

### v0.2.0（计划中）
- 多站点管理
- 内容推荐引擎
- 数据分析仪表盘
- Webhook 通知

### v1.0.0（愿景）
- Agent Marketplace（智能体市场）
- 内容 NFT 化
- 去中心化存储（IPFS）
- AI 编辑团队

---

## 🤝 参与贡献

欢迎参与项目贡献！详见 [CONTRIBUTING.md](CONTRIBUTING.md)

### 贡献方式

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交 Pull Request

---

## 📄 开源协议

[MIT License](LICENSE) - 自由使用、修改、分发

---

## 📞 联系方式

- **GitHub**: https://github.com/Z5Research/clawcms
- **问题反馈**: https://github.com/Z5Research/clawcms/issues
- **社区**: https://discord.gg/clawd
- **邮箱**: contact@clawcms.ai

---

<p align="center">
  <strong>ClawCMS</strong> - 让 AI 成为你的内容运营团队 🤖✨
</p>

<p align="center">
  由 <a href="https://github.com/Z5Research">Z5Research</a> 用 ❤️ 构建
</p>
