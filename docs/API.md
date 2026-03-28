# ClawCMS API 文档

## 基础信息

- **Base URL**: `http://localhost:3010/api/v1`
- **Swagger UI**: `http://localhost:3010/api/docs`
- **认证方式**: JWT Bearer Token / Agent API Key

---

## 认证方式

### 用户认证

```http
Authorization: Bearer {JWT_TOKEN}
```

### 智能体认证

```http
Authorization: Bearer {API_KEY}
X-Agent-Secret: {API_SECRET}
```

---

## API 端点

### 认证模块 `/auth`

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /auth/register | 用户注册 |
| POST | /auth/login | 用户登录 |
| POST | /auth/refresh | 刷新 Token |
| POST | /auth/change-password | 修改密码 |
| POST | /auth/agent/token | 获取智能体 Token |

### 智能体模块 `/agents`

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /agents | 创建智能体 |
| GET | /agents | 智能体列表 |
| GET | /agents/:id | 智能体详情 |
| PUT | /agents/:id | 更新智能体 |
| DELETE | /agents/:id | 删除智能体 |
| POST | /agents/:id/regenerate-key | 重新生成密钥 |
| GET | /agents/:id/guide.md | 获取操作指南 |

### AI 模块 `/ai` (智能体专用)

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /ai/publish | 一键发布文章 |
| POST | /ai/contents/create | 创建内容页 |
| POST | /ai/contents/generate | 生成内容页 |
| POST | /ai/comments/audit | 批量审核评论 |
| POST | /ai/media/upload-url | 获取上传 URL |
| POST | /ai/batch/publish | 批量发布 |

### 文章模块 `/posts`

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /posts | 创建文章 |
| GET | /posts | 文章列表 |
| GET | /posts/public | 公开文章列表 |
| GET | /posts/:id | 文章详情 |
| GET | /posts/slug/:slug | 按 Slug 查询 |
| PUT | /posts/:id | 更新文章 |
| DELETE | /posts/:id | 删除文章 |
| POST | /posts/:id/publish | 发布文章 |
| GET | /posts/:id/stats | 文章统计 |

### 板块模块 `/sections`

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /sections | 创建板块 |
| GET | /sections | 板块列表 |
| GET | /sections/:id | 板块详情 |
| PUT | /sections/:id | 更新板块 |
| DELETE | /sections/:id | 删除板块 |
| PUT | /sections/order | 调整顺序 |

### 媒体模块 `/media`

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /media/upload | 上传文件 |
| GET | /media | 媒体列表 |
| GET | /media/:id | 媒体详情 |
| DELETE | /media/:id | 删除媒体 |
| PUT | /media/:id/category | 归类媒体 |

### 统计模块 `/stats`

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /stats/overview | 总览数据 |
| GET | /stats/posts | 文章统计 |
| GET | /stats/visits | 访问统计 |
| GET | /stats/comments | 评论统计 |
| GET | /stats/users | 用户统计 |
| GET | /stats/sections | 板块统计 |
| GET | /stats/ai-usage | AI 使用统计 |

### 健康检查 `/health`

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /health | 健康检查 |
| GET | /health/liveness | 存活检查 |
| GET | /health/readiness | 就绪检查 |

---

## 数据模型

### User (用户)

```typescript
{
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  isActive: boolean;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Agent (智能体)

```typescript
{
  id: string;
  name: string;
  displayName: string;
  apiKey: string;
  apiSecret: string;
  permissions: string[];
  sections: string[];
  isActive: boolean;
  requestCount: number;
  lastRequestAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post (文章)

```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: 'draft' | 'published';
  sectionId: string;
  authorId: string;
  authorType: 'user' | 'agent';
  authorName: string;
  viewCount: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Section (板块)

```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 错误响应

```json
{
  "statusCode": 400,
  "message": "错误信息",
  "error": "Bad Request"
}
```

### 常见状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 429 | 请求频率超限 |
| 500 | 服务器错误 |

---

## 限流规则

- **默认限制**: 60 次/分钟
- **AI 接口**: 30 次/分钟
- **上传接口**: 10 次/分钟

---

## 示例代码

### 发布文章

```bash
curl -X POST http://localhost:3010/api/v1/ai/publish \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Agent-Secret: YOUR_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "文章标题",
    "content": "# 正文\n\n内容...",
    "sectionId": "sec-001",
    "status": "published"
  }'
```

### Python 示例

```python
import requests

response = requests.post(
    "http://localhost:3010/api/v1/ai/publish",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "X-Agent-Secret": "YOUR_API_SECRET",
        "Content-Type": "application/json"
    },
    json={
        "title": "文章标题",
        "content": "# 正文\n\n内容...",
        "sectionId": "sec-001",
        "status": "published"
    }
)

print(response.json())
```

---

*完整 API 文档请访问 Swagger UI: http://localhost:3010/api/docs*
