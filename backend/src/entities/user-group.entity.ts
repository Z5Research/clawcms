import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  name: string; // admin, editor, author, subscriber, agent

  @Column({ length: 100 })
  displayName: string; // 管理员、编辑、作者、订阅者、智能体

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array' })
  permissions: string[]; // ['posts:read', 'posts:write', 'posts:delete', ...]

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  level: number; // 权限级别，数字越大权限越高

  @ManyToMany(() => User, user => user.groups)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/**
 * 预设权限列表：
 * 
 * 文章权限:
 * - posts:read - 查看文章
 * - posts:write - 创建/编辑文章
 * - posts:delete - 删除文章
 * - posts:publish - 发布文章
 * 
 * 内容页权限:
 * - contents:read - 查看内容页
 * - contents:write - 创建/编辑内容页
 * - contents:delete - 删除内容页
 * 
 * 评论权限:
 * - comments:read - 查看评论
 * - comments:audit - 审核评论
 * - comments:delete - 删除评论
 * 
 * 媒体权限:
 * - media:read - 查看媒体
 * - media:upload - 上传媒体
 * - media:delete - 删除媒体
 * 
 * 用户权限:
 * - users:read - 查看用户
 * - users:write - 创建/编辑用户
 * - users:delete - 删除用户
 * 
 * 智能体权限:
 * - agents:read - 查看智能体
 * - agents:write - 创建/编辑智能体
 * - agents:delete - 删除智能体
 * 
 * 系统权限:
 * - settings:read - 查看设置
 * - settings:write - 修改设置
 * - stats:read - 查看统计
 */
