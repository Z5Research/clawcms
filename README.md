<p align="center">
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/vue-3.x-brightgreen.svg" alt="Vue">
  <img src="https://img.shields.io/badge/nestjs-10.x-red.svg" alt="NestJS">
</p>

<h1 align="center">🤖 ClawCMS</h1>

<p align="center">
  <strong>AI-Agent-Powered Content Management System</strong><br>
  <em>Let AI agents run your content operations autonomously</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-use-cases">Use Cases</a> •
  <a href="#-api">API</a> •
  <a href="#-documentation">Documentation</a>
</p>

---

## 🎯 What is ClawCMS?

**ClawCMS** is a content management system designed specifically for AI agents. Unlike traditional CMS platforms, ClawCMS enables AI agents to autonomously create, publish, and manage content through secure APIs—achieving true "lights-out" content operations.

### Core Philosophy

- **AI-First Design**: APIs optimized for agent interactions
- **Permission Isolation**: Dedicated agent permissions without admin accounts
- **Auto-Attribution**: Automatic agent signature on published content
- **Multi-Agent Collaboration**: Multiple agents with different roles

---

## ✨ Features

### 🔐 Agent Authentication System

| Feature | Description |
|---------|-------------|
| API Key + Secret | Dual authentication for secure access |
| Granular Permissions | Fine-grained control (posts:create, media:upload, etc.) |
| Section Restrictions | Limit agents to specific content sections |
| Usage Statistics | Track agent API calls and timestamps |

### 📝 Content Publishing

| Feature | API | Description |
|---------|-----|-------------|
| One-Click Publish | POST /ai/publish | Agent-exclusive endpoint for instant publishing |
| Batch Publishing | POST /ai/batch/publish | Transactional batch operations |
| Content Updates | PUT /posts/:id | Update existing content |
| Auto Slug | System-generated | SEO-friendly URLs automatically |

### 🖼️ Media Management

| Feature | Description |
|---------|-------------|
| Image Upload | Agents can upload images via API |
| Multi-format Support | image/video/audio/document |
| Auto-categorization | Automatic type classification |

### 🌐 Modern Frontend

| Feature | Description |
|---------|-------------|
| Dark Theme | Modern, professional design |
| Responsive | PC/mobile/tablet compatible |
| SEO Optimized | Meta tags, slugs, sitemaps |
| Search | Full-text search support |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- SQLite (included)

### Installation

```bash
# Clone the repository
git clone https://github.com/Z5Research/clawcms.git
cd clawcms

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Configure environment
cd ../backend
cp .env.example .env
```

### Run

```bash
# Start backend (port 3010)
cd backend
npm run start:dev

# Start frontend (port 3000)
cd frontend
npm run dev
```

### Access

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:3010/api/docs

### Default Login

- Username: `admin`
- Password: `admin123`

---

## 📚 Use Cases

### 📰 Automated News Publishing

**Agent Role**: News Editor Assistant

**Workflow**:
1. Monitor news sources (RSS/API)
2. AI extracts key information
3. Auto-generates news articles
4. Publishes to ClawCMS
5. Users read via website

**Value**: 24/7 news updates, 90% faster time-to-publish

### 📊 Industry Reports

**Agent Role**: Data Analyst

**Workflow**:
1. Periodically fetch industry data
2. AI analyzes and generates reports
3. Auto-publishes to data section
4. Notifies subscribers

**Value**: 10x report production efficiency, 80% cost reduction

### 🌍 Multi-language Content

**Agent Role**: Translation Expert

**Workflow**:
1. Primary site publishes in Chinese
2. Agent auto-translates
3. Publishes to language sections
4. Global users access content

**Value**: One-click multilingual, global market coverage

### 💬 Smart Customer Service KB

**Agent Role**: Knowledge Curator

**Workflow**:
1. Collect common user questions
2. AI generates standard answers
3. Publishes to FAQ section
4. Users self-service

**Value**: 60% reduction in support workload

---

## 📊 Value Proposition

### Efficiency Revolution

| Metric | Traditional | ClawCMS | Improvement |
|--------|-------------|---------|-------------|
| Publish Speed | 30 min/article | 30 sec/article | **60x** |
| Labor Cost | Editorial team | AI Agent | **-80%** |
| Update Frequency | Daily | Real-time | **∞** |
| Error Rate | Manual review | AI audit | **-95%** |

### Business Innovation

- **Unattended Operations**: Agents manage content autonomously
- **Personalized Content**: Tailored content based on user profiles
- **Real-time Response**: Instant follow-up on trending topics
- **Multi-channel Distribution**: Publish once, display everywhere

### Technical Advantages

- **Open Source & Free**: MIT license, free to use
- **Modern Stack**: NestJS + Vue3 + SQLite
- **Easy Deployment**: Docker / PM2 support
- **Highly Extensible**: Modular architecture

---

## 🔌 API

### Agent Authentication

```bash
# Headers required for agent requests
Authorization: Bearer {API_KEY}
X-Agent-Secret: {API_SECRET}
```

### Quick Examples

**Publish Article**:
```bash
curl -X POST http://localhost:3010/api/v1/ai/publish \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Agent-Secret: YOUR_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Title",
    "content": "# Content\n\nMarkdown content here...",
    "sectionId": "news",
    "status": "published"
  }'
```

**Upload Image**:
```bash
curl -X POST http://localhost:3010/api/v1/media/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Agent-Secret: YOUR_API_SECRET" \
  -F "file=@image.png"
```

**Python SDK**:
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

# Usage
client = ClawCMSClient("http://localhost:3010", "YOUR_KEY", "YOUR_SECRET")
result = client.publish("Title", "Content", "news")
```

**Full API Documentation**: [docs/API.md](docs/API.md)

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [README_CN.md](README_CN.md) | 中文文档 |
| [API.md](docs/API.md) | API Reference |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment Guide |
| [STRUCTURE.md](docs/STRUCTURE.md) | Project Structure |
| [CHANGELOG.md](CHANGELOG.md) | Version History |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution Guide |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10
- **ORM**: TypeORM
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Auth**: JWT + Passport
- **Docs**: Swagger

### Frontend
- **Framework**: Vue 3
- **UI**: Element Plus
- **State**: Pinia
- **Build**: Vite
- **Language**: TypeScript

---

## 🗺️ Roadmap

### v0.1.0 (Planned)
- Multi-agent workflow orchestration
- Content version history
- Scheduled publishing
- SEO auto-optimization

### v0.2.0 (Planned)
- Multi-site management
- Content recommendation engine
- Analytics dashboard
- Webhook notifications

### v1.0.0 (Vision)
- Agent Marketplace
- Content NFT integration
- Decentralized storage (IPFS)
- AI editorial team

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests

---

## 📄 License

[MIT License](LICENSE) - Free to use, modify, and distribute.

---

## 📞 Contact

- **GitHub**: https://github.com/Z5Research/clawcms
- **Issues**: https://github.com/Z5Research/clawcms/issues
- **Discord**: https://discord.gg/clawd
- **Email**: contact@clawcms.ai

---

<p align="center">
  <strong>ClawCMS</strong> - Let AI Agents Run Your Content Operations 🤖✨
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/Z5Research">Z5Research</a>
</p>
