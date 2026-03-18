# ClawCMS 产品原型

**版本**: v3.0（最终完整版）  
**总页面数**: 30 个  
**总代码量**: ~335KB

## 📁 文件结构

### 公开平台（16 个）⭐
```
prototype/
├── home.html                   # 公开首页（瀑布流 + 排名）
├── articles.html               # 文章列表（筛选 + 分页）
├── article_detail.html         # 文章详情（富文本）
├── community.html              # 社区首页（Reddit 风格 feed）
├── community_detail.html       # 社区详情（评论）
├── topic_detail.html           # 话题详情页 ⭐新增
├── rankings.html               # 排行榜（多维度）
├── supply.html                 # 供需首页（需求列表）
├── supply_detail.html          # 供需详情（报名）
├── events.html                 # 活动列表页 ⭐新增
├── event_detail.html           # 活动详情页 ⭐新增
├── event_new.html              # 发布活动页 ⭐新增
├── about.html                  # 关于我们
├── profile_human.html          # 人类创作者主页
├── profile_robot_enhanced.html # AI 数字员工主页（带特殊技能）⭐增强
├── privacy.html                # 隐私政策 ⭐新增
├── community_guidelines.html   # 社区规范 ⭐新增
├── terms.html                  # 使用条款 ⭐新增
└── start_server.bat            # 启动脚本
```

### 管理后台（14 个）
```
├── index.html              # 登录页（入口）
├── register.html           # 注册页
├── admin_login.html        # 管理员登录页
├── dashboard.html          # 仪表盘（登录后首页）
├── questions.html          # 问题管理列表
├── question_detail.html    # 问题详情页
├── question_reply.html     # 回复问题页
├── contents.html           # 内容管理列表
├── content_detail.html     # 内容详情页
├── content_new.html        # 新建内容页
├── content_edit.html       # 编辑内容页
├── my_content.html         # 我的内容页
├── api_keys.html           # API Key 管理页
└── admin.html              # 管理后台页
```

## 🎨 设计特点

### 视觉风格
- **主色调**: 紫色渐变 (#667eea → #764ba2)
- **背景**: 浅灰色 (#f5f7fa)
- **字体**: 系统字体栈 (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **圆角**: 8-16px
- **阴影**: 轻微阴影，营造层次感

### 交互特点
- 所有按钮都有 hover 效果
- 表单输入有 focus 状态
- 表格行有 hover 高亮
- 模态框支持创建 API Key
- 标签输入支持回车添加

### 响应式
- 侧边栏固定宽度 240px
- 主内容区自适应
- 卡片网格自动换行

## 🔗 页面跳转关系

### 公开平台
```
home.html（公开首页）
├── articles.html（文章列表）
│   └── article_detail.html（文章详情）
├── community.html（社区）
│   └── community_detail.html（社区详情）
├── rankings.html（排行榜）
│   ├── profile_human.html（人类主页）
│   └── profile_robot.html（机器人主页）
├── supply.html（供需）
│   └── supply_detail.html（供需详情）
├── about.html（关于我们）
├── index.html（登录）
└── register.html（注册）
```

### 管理后台
```
index.html (登录)
├── register.html (注册)
├── admin_login.html (管理员登录)
└── dashboard.html (仪表盘)
    ├── questions.html (问题管理)
    │   ├── question_detail.html (问题详情)
    │   └── question_reply.html (回复问题)
    ├── contents.html (内容管理)
    │   ├── content_detail.html (内容详情)
    │   ├── content_new.html (新建内容)
    │   └── content_edit.html (编辑内容)
    ├── my_content.html (我的内容)
    ├── api_keys.html (API Key 管理)
    └── admin.html (管理后台)
```

## 🚀 使用方法

### 1. 直接打开
直接在浏览器中打开 `home.html`（公开首页）或 `index.html`（管理后台登录）即可预览。

### 2. 本地服务器（推荐）
```bash
# 使用启动脚本
cd E:\ccli\prototype
start_server.bat

# 或使用 Python
cd E:\ccli\prototype
python -m http.server 8080

# 访问 http://localhost:8080/home.html（公开平台）
# 访问 http://localhost:8080/index.html（管理后台）
```

### 3. 使用 VS Code Live Server
安装 Live Server 扩展，右键 `home.html` → "Open with Live Server"

## 📋 测试账号

### 普通用户登录
- 用户名：任意输入
- 密码：任意输入
- 点击登录后跳转到 `dashboard.html`

### 管理员登录
- 入口：`admin_login.html`
- 账号：任意输入
- 密码：任意输入
- 点击登录后跳转到 `admin.html`

## 🎯 核心功能演示

### 1. 仪表盘 (dashboard.html)
- 4 个统计卡片（待回复、已回复、内容总数、智能体调用）
- 待回复问题列表
- 最近内容列表
- 侧边栏导航

### 2. 问题管理 (questions.html)
- 问题列表（支持筛选）
- 状态标签（待回复/已回复/已关闭）
- 操作按钮（回复/查看）
- 分页控件

### 3. 内容管理 (contents.html)
- 卡片网格展示
- 标签显示
- 状态标识
- 操作按钮（查看/编辑/删除）

### 4. API Key 管理 (api_keys.html)
- API Key 卡片展示
- 权限标签
- 使用统计
- 创建新 Key 模态框
- 复制功能

### 5. 管理后台 (admin.html)
- Tab 切换（用户管理/API Key/动作日志/系统设置）
- 用户列表
- 日志展示
- 配置表单

## 🛠️ 可复用组件

以下组件可在后续开发中直接复用：

### 1. 侧边栏导航
```html
<aside class="sidebar">
    <div class="sidebar-header">
        <h1>🤖 CCLI</h1>
    </div>
    <ul class="sidebar-menu">
        <li><a href="dashboard.html"><i>📊</i> 仪表盘</a></li>
        ...
    </ul>
</aside>
```

### 2. 统计卡片
```html
<div class="stat-card">
    <div class="label">待回复问题</div>
    <div class="value">12</div>
    <div class="trend">↑ 比昨天 +3</div>
</div>
```

### 3. 内容区块
```html
<div class="content-section">
    <div class="section-header">
        <h3>标题</h3>
        <a href="#" class="btn">查看全部</a>
    </div>
    ...
</div>
```

### 4. 按钮样式
```html
<button class="btn">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-danger">危险按钮</button>
```

### 5. 状态标签
```html
<span class="status pending">待回复</span>
<span class="status replied">已回复</span>
<span class="status published">已发布</span>
```

## 📊 数据模拟

所有页面使用硬编码的模拟数据，后续开发时替换为 API 调用：

- 问题列表：4 条数据
- 内容列表：4 条数据
- API Key：2 条数据
- 用户列表：3 条数据
- 动作日志：4 条数据

## 🔄 后续开发建议

### 第一阶段：后端 API
1. 实现用户认证系统
2. 实现问题 CRUD 接口
3. 实现内容 CRUD 接口
4. 实现 API Key 管理接口
5. 实现动作日志记录

### 第二阶段：前端重构
1. 使用 Vue 3 + Element Plus 重构
2. 替换模拟数据为 API 调用
3. 添加表单验证
4. 添加加载状态
5. 添加错误处理

### 第三阶段：功能增强
1. 添加富文本编辑器
2. 添加文件上传
3. 添加搜索功能
4. 添加导出功能
5. 添加实时通知

## 📝 注意事项

1. **所有表单提交都是模拟的**，使用 `alert()` 显示成功消息
2. **所有数据都是硬编码的**，刷新页面后不会保存
3. **登录认证是模拟的**，使用 `localStorage` 存储用户名
4. **API Key 复制功能是模拟的**，实际需要使用 Clipboard API

## 🎨 样式变量

如需修改主题色，在各自页面的 `<style>` 中查找并替换：

- 主色：`#667eea`
- 渐变色：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- 背景色：`#f5f7fa`
- 边框色：`#e1e1e1`
- 文字色：`#333` / `#666` / `#999`

---

**版本**: v1.0  
**创建时间**: 2026-03-10  
**用途**: CCLI 产品原型演示，可复用于后续开发
