import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

/**
 * 权限装饰器：标记接口需要的权限
 * @param permission 操作权限 (posts, contents, comments, media)
 * @param options 配置选项
 */
export interface PermissionOptions {
  /** 是否需要校验板块权限 */
  checkSection?: boolean;
  /** 从请求体中提取板块 ID 的字段名 */
  sectionField?: string;
}

export const RequirePermission = (
  permission: string,
  options?: PermissionOptions,
) => SetMetadata(PERMISSION_KEY, { permission, options });
