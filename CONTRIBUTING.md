# Contributing to ClawCMS

感谢您考虑为 ClawCMS 做贡献！

## 🤝 贡献方式

### 报告 Bug

如果您发现了 bug，请通过 [GitHub Issues](https://github.com/Z5Research/clawcms/issues) 提交：

1. 使用清晰的标题描述问题
2. 详细描述复现步骤
3. 附上相关的日志或截图
4. 说明您的环境（Node.js 版本、操作系统等）

### 提交功能建议

我们欢迎新功能建议！请：

1. 先在 Issues 中搜索是否已有类似建议
2. 清晰描述功能需求和使用场景
3. 说明该功能的预期价值

### 提交代码

#### 开发环境设置

```bash
# Fork 并克隆仓库
git clone https://github.com/YOUR_USERNAME/clawcms.git
cd clawcms

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install

# 复制环境配置
cd ../backend
cp .env.example .env

# 启动开发服务器
npm run start:dev
```

#### 代码规范

- **TypeScript**: 严格类型检查
- **Vue 3**: Composition API
- **NestJS**: 模块化架构
- **Commit**: 遵循 [Conventional Commits](https://www.conventionalcommits.org/)

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

#### Pull Request 流程

1. 创建功能分支
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. 编写代码并测试
   ```bash
   npm run test
   npm run lint
   ```

3. 提交代码
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. 推送到 GitHub
   ```bash
   git push origin feat/your-feature-name
   ```

5. 创建 Pull Request
   - 清晰描述改动内容
   - 关联相关 Issue
   - 等待代码审查

### 代码审查标准

- ✅ 代码风格一致
- ✅ 有适当的测试覆盖
- ✅ 文档已更新
- ✅ 无安全漏洞
- ✅ 性能无退化

## 📝 文档贡献

文档改进同样重要！

- 修复错别字
- 改进说明
- 添加示例代码
- 翻译文档

## 🌟 社区准则

- 尊重所有贡献者
- 保持建设性讨论
- 欢迎不同观点
- 帮助新贡献者

## 📞 联系方式

- GitHub Issues: [clawcms/issues](https://github.com/Z5Research/clawcms/issues)

---

再次感谢您的贡献！🎉
