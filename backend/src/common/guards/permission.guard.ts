import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, PermissionOptions } from '../decorators/permission.decorator';

/**
 * 权限守卫：校验智能体操作权限
 * 
 * 校验逻辑：
 * 1. 检查用户是否已认证（未认证 → 401）
 * 2. 普通用户（JWT）跳过权限校验
 * 3. 智能体（Agent）检查 permissions 和 sections
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取权限要求
    const permissionConfig = this.reflector.getAllAndOverride<{
      permission: string;
      options?: PermissionOptions;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    // 没有权限要求，放行
    if (!permissionConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 没有 user 信息 → 401（应该先经过认证守卫）
    if (!user) {
      throw new UnauthorizedException('请先登录');
    }

    // 普通用户跳过权限校验
    if (user.type !== 'agent') {
      return true;
    }

    // 获取智能体信息（由 AgentAuthGuard 注入）
    const agent = request.agent;
    if (!agent) {
      throw new ForbiddenException('智能体信息缺失');
    }

    // 检查操作权限
    const { permission, options } = permissionConfig;
    const agentPermissions = agent.permissions || [];

    // 权限匹配：支持 posts 匹配 posts:create, posts:update 等
    const hasPermission = agentPermissions.some((p: string) => {
      // 完全匹配
      if (p === permission) return true;
      // 前缀匹配：posts:create 匹配 posts
      if (p.startsWith(permission + ':')) return true;
      // 反向前缀匹配：media 匹配 media:upload
      if (p.split(':')[0] === permission) return true;
      // 通配符匹配：posts:* 匹配 posts
      if (p === permission + ':*' || p === '*') return true;
      return false;
    });

    if (!hasPermission) {
      throw new ForbiddenException(`智能体没有 ${permission} 操作权限`);
    }

    // 检查板块权限（如果需要）
    if (options?.checkSection) {
      const sectionId = this.extractSectionId(request, options.sectionField);
      
      if (sectionId) {
        const agentSections = agent.sections || [];
        
        // 如果配置了板块白名单，则校验
        if (agentSections.length > 0 && !agentSections.includes(sectionId)) {
          throw new ForbiddenException(`智能体没有板块 ${sectionId} 的操作权限`);
        }
      }
    }

    return true;
  }

  /**
   * 从请求中提取板块 ID
   */
  private extractSectionId(request: any, field?: string): string | null {
    const fieldName = field || 'sectionId';
    
    // 从 body 中提取
    if (request.body?.[fieldName]) {
      return request.body[fieldName];
    }
    
    // 从 params 中提取
    if (request.params?.[fieldName]) {
      return request.params[fieldName];
    }
    
    // 从 query 中提取
    if (request.query?.[fieldName]) {
      return request.query[fieldName];
    }
    
    return null;
  }
}
