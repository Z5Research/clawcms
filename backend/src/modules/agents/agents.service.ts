import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../entities/agent.entity';
import * as crypto from 'crypto';

export interface CreateAgentDto {
  name: string;
  displayName: string;
  description?: string;
  permissions?: string[];
  sections?: string[];
  webhook?: string;
}

export interface UpdateAgentDto {
  displayName?: string;
  description?: string;
  permissions?: string[];
  sections?: string[];
  webhook?: string;
  isActive?: boolean;
}

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentsRepository: Repository<Agent>,
  ) {}

  /**
   * 生成 API Key
   * 格式：tlh_xxxxxxxxxxxxxxxxxxxxxx (24位随机字符)
   */
  private generateApiKey(): string {
    return 'tlh_' + crypto.randomBytes(18).toString('hex');
  }

  /**
   * 生成 API Secret
   * 32位随机字符
   */
  private generateApiSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * 创建智能体
   */
  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    // 检查名称是否已存在
    const existing = await this.agentsRepository.findOne({
      where: { name: createAgentDto.name },
    });
    if (existing) {
      throw new BadRequestException(`智能体 ${createAgentDto.name} 已存在`);
    }

    const agent = this.agentsRepository.create({
      ...createAgentDto,
      apiKey: this.generateApiKey(),
      apiSecret: this.generateApiSecret(),
      permissions: createAgentDto.permissions || ['posts'],
      isActive: true,
    });

    const saved = await this.agentsRepository.save(agent);
    
    // 生成在线文档
    saved.guideUrl = await this.generateGuideMd(saved);
    await this.agentsRepository.save(saved);

    return saved;
  }

  /**
   * 获取所有智能体
   */
  async findAll(): Promise<Agent[]> {
    return this.agentsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 获取智能体详情
   */
  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException(`智能体 ${id} 不存在`);
    }
    return agent;
  }

  /**
   * 根据 API Key 查找智能体
   */
  async findByApiKey(apiKey: string): Promise<Agent | null> {
    return this.agentsRepository.findOne({
      where: { apiKey, isActive: true },
    });
  }

  /**
   * 更新智能体
   */
  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);
    Object.assign(agent, updateAgentDto);
    
    if (updateAgentDto.permissions || updateAgentDto.sections) {
      agent.guideUrl = await this.generateGuideMd(agent);
    }

    return this.agentsRepository.save(agent);
  }

  /**
   * 重新生成 API Key
   */
  async regenerateKey(id: string): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.apiKey = this.generateApiKey();
    agent.apiSecret = this.generateApiSecret();
    agent.guideUrl = await this.generateGuideMd(agent);
    return this.agentsRepository.save(agent);
  }

  /**
   * 删除智能体
   */
  async remove(id: string): Promise<void> {
    const result = await this.agentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`智能体 ${id} 不存在`);
    }
  }

  /**
   * 记录 API 调用
   */
  async recordRequest(id: string): Promise<void> {
    await this.agentsRepository.update(id, {
      requestCount: () => 'requestCount + 1',
      lastRequestAt: new Date(),
    });
  }

  /**
   * 生成在线 MD 文档
   */
  private async generateGuideMd(agent: Agent): Promise<string> {
    // 返回文档 URL
    return `/api/v1/agents/${agent.id}/guide.md`;
  }

  /**
   * 生成文档内容
   */
  async generateGuideContent(agent: Agent): Promise<string> {
    const permissions = agent.permissions?.join('、') || 'posts';
    const sections = agent.sections?.join(',') || '所有板块';

    return `# ${agent.displayName} 智能体 API 文档

## 基本信息

- **名称**: ${agent.name}
- **描述**: ${agent.description || '暂无描述'}
- **API Key**: \`${agent.apiKey}\`
- **API Secret**: \`${agent.apiSecret}\` (请妥善保管)

## 权限范围

- **允许操作**: ${permissions}
- **允许板块**: ${sections}

## API 端点

### 基础 URL
\`\`\`
http://localhost:3002/api/v1
\`\`\`

### 认证方式

在请求头中添加：
\`\`\`
Authorization: Bearer {API_KEY}
X-Agent-Secret: {API_SECRET}
\`\`\`

## 发布文章

\`\`\`http
POST /api/v1/ai/publish
Content-Type: application/json

{
  "title": "文章标题",
  "content": "Markdown 内容",
  "sectionId": "板块ID",
  "excerpt": "摘要",
  "featuredImage": "封面图URL",
  "status": "published"
}
\`\`\`

**响应示例**：
\`\`\`json
{
  "id": "post-xxx",
  "title": "文章标题",
  "slug": "article-slug",
  "status": "published",
  "publishedAt": "2026-03-26T15:00:00.000Z",
  "author": {
    "name": "${agent.name}",
    "type": "agent"
  }
}
\`\`\`

## 署名规则

所有通过此 API 发布的内容将自动署名为：
- **作者**: ${agent.displayName}
- **来源**: 智能体发布

## 使用示例

### Python
\`\`\`python
import requests

API_KEY = "${agent.apiKey}"
API_SECRET = "${agent.apiSecret}"
BASE_URL = "http://localhost:3002/api/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Agent-Secret": API_SECRET,
    "Content-Type": "application/json"
}

# 发布文章
data = {
    "title": "测试文章",
    "content": "# 测试内容\\n\\n这是测试。",
    "sectionId": "sec-001",
    "status": "published"
}

response = requests.post(f"{BASE_URL}/ai/publish", json=data, headers=headers)
print(response.json())
\`\`\`

### cURL
\`\`\`bash
curl -X POST http://localhost:3002/api/v1/ai/publish \\
  -H "Authorization: Bearer ${agent.apiKey}" \\
  -H "X-Agent-Secret: ${agent.apiSecret}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "测试文章",
    "content": "# 测试内容",
    "sectionId": "sec-001",
    "status": "published"
  }'
\`\`\`

## 注意事项

1. **保密**: API Secret 仅显示一次，请妥善保存
2. **频率**: 每分钟最多 60 次请求
3. **署名**: 所有内容将署名为 ${agent.displayName}
4. **权限**: 只能操作授权范围内的内容

## 联系管理员

如有问题，请联系管理员。

---

*文档生成时间: ${new Date().toISOString()}*
*文档版本: v1.0*
`;
  }
}
