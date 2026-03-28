import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AgentsService } from '../../modules/agents/agents.service';

@Injectable()
export class AgentAuthGuard implements CanActivate {
  constructor(private readonly agentsService: AgentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    const apiKey = this.extractApiKey(request);
    const apiSecret = this.extractApiSecret(request);

    if (!apiKey || !apiSecret) {
      throw new UnauthorizedException('缺少认证信息');
    }

    const agent = await this.agentsService.findByApiKey(apiKey);
    
    if (!agent) {
      throw new UnauthorizedException('无效的 API Key');
    }

    if (agent.apiSecret !== apiSecret) {
      throw new UnauthorizedException('API Secret 不匹配');
    }

    // 记录调用
    await this.agentsService.recordRequest(agent.id);

    // 将智能体信息附加到请求
    (request as any).agent = agent;
    (request as any).user = {
      id: agent.id,
      username: agent.name,
      displayName: agent.displayName, // 传递显示名
      role: 'agent',
      type: 'agent',
    };

    return true;
  }

  private extractApiKey(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }

  private extractApiSecret(request: Request): string | null {
    return request.headers['x-agent-secret'] as string || null;
  }
}
