# ClawCMS 部署指南

## 目录

- [环境要求](#环境要求)
- [本地开发](#本地开发)
- [Docker 部署](#docker-部署)
- [生产部署](#生产部署)
- [Nginx 配置](#nginx-配置)
- [数据库迁移](#数据库迁移)

---

## 环境要求

### 基础环境

| 软件 | 版本 | 说明 |
|------|------|------|
| Node.js | 18+ | 推荐 20+ |
| npm/yarn/pnpm | 最新版 | 包管理器 |
| SQLite | 3 | 开发环境 |
| PostgreSQL | 14+ | 生产环境推荐 |
| Docker | 20+ | 容器化部署 |

### 系统要求

| 项目 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 1核 | 2核+ |
| 内存 | 1GB | 2GB+ |
| 磁盘 | 10GB | 20GB+ |

---

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/Z5Research/clawcms.git
cd clawcms
```

### 2. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 3. 配置环境

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件
```

### 4. 启动服务

```bash
# 后端 (端口 3010)
cd backend
npm run start:dev

# 前端 (端口 3000)
cd frontend
npm run dev
```

### 5. 访问

- 前端: http://localhost:3000
- API: http://localhost:3010/api/v1
- Swagger: http://localhost:3010/api/docs

---

## Docker 部署

### 快速启动

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 自定义配置

```bash
# 创建 .env 文件
cat > .env << EOF
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://yourdomain.com
EOF

# 启动
docker-compose up -d
```

### Docker 命令

```bash
# 重新构建
docker-compose build --no-cache

# 查看状态
docker-compose ps

# 进入容器
docker-compose exec backend sh

# 查看日志
docker-compose logs -f backend
```

---

## 生产部署

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx
sudo apt install -y nginx
```

### 2. 部署后端

```bash
# 克隆代码
git clone https://github.com/Z5Research/clawcms.git /var/www/clawcms
cd /var/www/clawcms/backend

# 安装依赖
npm install --production

# 构建
npm run build

# 配置环境
cp .env.example .env
nano .env
```

### 3. PM2 配置

```bash
# 创建 ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'clawcms-backend',
    script: 'dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3010
    }
  }]
}
EOF

# 启动
pm2 start ecosystem.config.js

# 开机自启
pm2 startup
pm2 save
```

### 4. 部署前端

```bash
cd /var/www/clawcms/frontend

# 安装依赖
npm install

# 构建
npm run build

# 部署到 Nginx
sudo cp -r dist/* /var/www/html/clawcms/
```

---

## Nginx 配置

### 基础配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # 前端
    location / {
        root /var/www/html/clawcms;
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 上传文件
    location /uploads {
        alias /var/www/clawcms/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### HTTPS 配置

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 数据库迁移

### SQLite → PostgreSQL

```bash
# 1. 导出数据
sqlite3 clawcms.db .dump > dump.sql

# 2. 转换 SQL
# (需要手动调整语法)

# 3. 导入 PostgreSQL
psql -U clawcms -d clawcms -f dump.sql
```

### 数据备份

```bash
# SQLite
cp clawcms.db clawcms_$(date +%Y%m%d).db

# PostgreSQL
pg_dump -U clawcms clawcms > backup_$(date +%Y%m%d).sql
```

---

## 监控与日志

### PM2 监控

```bash
# 监控面板
pm2 monit

# 查看日志
pm2 logs

# 状态
pm2 status
```

### 日志轮转

```bash
# /etc/logrotate.d/clawcms
/var/www/clawcms/logs/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
}
```

---

## 故障排查

### 常见问题

**1. 端口被占用**

```bash
# 查看端口占用
lsof -i :3010

# 杀掉进程
kill -9 <PID>
```

**2. 权限问题**

```bash
# 修复权限
sudo chown -R www-data:www-data /var/www/clawcms
sudo chmod -R 755 /var/www/clawcms
```

**3. 数据库错误**

```bash
# 检查数据库文件
ls -la backend/*.db

# 重新初始化
rm backend/clawcms.db
npm run init-db
```

---

## 性能优化

### 后端优化

1. 启用集群模式 (PM2)
2. 使用 PostgreSQL 替代 SQLite
3. 启用 Redis 缓存
4. CDN 加速静态资源

### 前端优化

1. 启用 Gzip 压缩
2. 静态资源缓存
3. 图片懒加载
4. 代码分割

---

*Last updated: 2026-03-29*
