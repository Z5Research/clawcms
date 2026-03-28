# ClawCMS 项目结构

```
clawcms/
├── backend/                    # NestJS 后端
│   ├── src/
│   │   ├── common/            # 公共模块
│   │   │   ├── decorators/    # 装饰器
│   │   │   ├── guards/        # 守卫（认证、权限）
│   │   │   ├── pipes/         # 管道（XSS过滤）
│   │   │   └── filters/       # 过滤器
│   │   ├── entities/          # 数据库实体
│   │   │   ├── user.entity.ts
│   │   │   ├── post.entity.ts
│   │   │   ├── section.entity.ts
│   │   │   ├── media.entity.ts
│   │   │   ├── agent.entity.ts
│   │   │   └── ...
│   │   ├── modules/           # 业务模块
│   │   │   ├── auth/          # 认证模块
│   │   │   ├── posts/         # 文章模块
│   │   │   ├── sections/      # 板块模块
│   │   │   ├── media/         # 媒体模块
│   │   │   ├── agents/        # 智能体模块
│   │   │   ├── ai/            # AI接口模块
│   │   │   ├── users/         # 用户模块
│   │   │   ├── comments/      # 评论模块
│   │   │   ├── contents/      # 内容页模块
│   │   │   ├── stats/         # 统计模块
│   │   │   ├── audit/         # 审计模块
│   │   │   └── user-groups/   # 用户分组模块
│   │   ├── app.module.ts      # 应用主模块
│   │   └── main.ts            # 入口文件
│   ├── public/                # 静态文件
│   ├── uploads/               # 上传文件
│   ├── test/                  # 测试文件
│   ├── .env                   # 环境配置
│   ├── .env.example           # 环境配置示例
│   ├── Dockerfile             # Docker 构建文件
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Vue3 前端
│   ├── src/
│   │   ├── api/               # API 接口
│   │   ├── components/        # 公共组件
│   │   ├── views/
│   │   │   ├── frontend/      # 前台页面
│   │   │   │   ├── Home.vue       # 首页
│   │   │   │   ├── Posts.vue      # 文章列表
│   │   │   │   ├── PostDetail.vue # 文章详情
│   │   │   │   ├── Services.vue   # 服务页
│   │   │   │   ├── About.vue      # 关于页
│   │   │   │   └── Layout.vue     # 布局组件
│   │   │   └── admin/         # 后台页面
│   │   │       ├── Dashboard.vue  # 仪表盘
│   │   │       ├── Posts.vue      # 文章管理
│   │   │       ├── Agents.vue     # 智能体管理
│   │   │       ├── Users.vue      # 用户管理
│   │   │       ├── Media.vue      # 媒体管理
│   │   │       └── ...
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # Pinia 状态管理
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/                # 静态资源
│   ├── Dockerfile             # Docker 构建文件
│   ├── nginx.conf             # Nginx 配置
│   ├── vite.config.ts         # Vite 配置
│   └── package.json
│
├── docs/                       # 文档目录
│   ├── API.md                 # API 文档
│   ├── DEPLOYMENT.md          # 部署文档
│   └── AGENT-GUIDE.md         # 智能体指南
│
├── scripts/                    # 脚本目录
│   ├── setup.sh               # 安装脚本
│   └── deploy.sh              # 部署脚本
│
├── .gitignore                  # Git 忽略配置
├── docker-compose.yml          # Docker Compose 配置
├── CHANGELOG.md                # 变更日志
├── CONTRIBUTING.md             # 贡献指南
├── LICENSE                     # MIT 开源协议
└── README.md                   # 项目说明

```

## 核心模块说明

### 后端模块

| 模块 | 功能 | API 端点数 |
|------|------|-----------|
| auth | 用户认证 | 6 |
| agents | 智能体管理 | 7 |
| ai | AI 发布接口 | 6 |
| posts | 文章管理 | 8 |
| sections | 板块管理 | 6 |
| media | 媒体管理 | 5 |
| users | 用户管理 | 7 |
| contents | 内容页管理 | 8 |
| comments | 评论管理 | 7 |
| stats | 数据统计 | 7 |
| audit | 审计日志 | 4 |
| user-groups | 用户分组 | 7 |
| **总计** | - | **88** |

### 前端页面

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | / | 精美落地页 |
| Blog | /posts | 文章列表 |
| 文章详情 | /posts/:slug | 文章详情 |
| 服务 | /services | 服务介绍 |
| 关于 | /about | 关于我们 |
| 管理后台 | /admin | 内容管理 |
| 登录 | /login | 用户登录 |

## 技术栈

### 后端
- **框架**: NestJS 10
- **ORM**: TypeORM
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **认证**: JWT + Passport
- **文档**: Swagger
- **安全**: Helmet, XSS过滤, 限流

### 前端
- **框架**: Vue 3
- **UI**: Element Plus
- **状态**: Pinia
- **路由**: Vue Router
- **构建**: Vite
- **语言**: TypeScript

---

*Created by Z7 ⚡*
