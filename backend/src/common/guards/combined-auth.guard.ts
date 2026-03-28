import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AgentAuthGuard } from './agent-auth.guard';
import { Observable, lastValueFrom } from 'rxjs';

/**
 * 组合认证守卫：支持 JWT 用户认证和 Agent API Key 认证
 * 
 * 认证顺序：
 * 1. 检查是否有 JWT Token 或 Agent API Key
 * 2. 有 JWT Token → 尝试 JWT 认证
 * 3. 有 Agent API Key → 尝试 Agent 认证
 * 4. 都没有 → 返回 401 Unauthorized
 */
@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly agentAuthGuard: AgentAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const agentSecret = request.headers['x-agent-secret'];

    // 判断认证类型
    const hasJwtToken = authHeader?.startsWith('Bearer ') && !agentSecret;
    const hasAgentAuth = authHeader?.startsWith('Bearer ') && agentSecret;
    const hasNoAuth = !authHeader || !authHeader.startsWith('Bearer ');

    // 无认证信息 → 401
    if (hasNoAuth) {
      throw new UnauthorizedException('请先登录或提供有效的认证信息');
    }

    // JWT 用户认证
    if (hasJwtToken) {
      try {
        const result = this.jwtAuthGuard.canActivate(context);
        return this.resolveResult(result);
      } catch (e) {
        throw new UnauthorizedException('Token 无效或已过期');
      }
    }

    // Agent 智能体认证
    if (hasAgentAuth) {
      try {
        const result = this.agentAuthGuard.canActivate(context);
        return this.resolveResult(result);
      } catch (e) {
        if (e instanceof UnauthorizedException) {
          throw e;
        }
        throw new UnauthorizedException('智能体认证失败');
      }
    }

    throw new UnauthorizedException('无效的认证方式');
  }

  private async resolveResult(result: boolean | Promise<boolean> | Observable<boolean>): Promise<boolean> {
    if (typeof result === 'boolean') {
      return result;
    }
    if (result instanceof Promise) {
      return result;
    }
    return lastValueFrom(result);
  }
}
