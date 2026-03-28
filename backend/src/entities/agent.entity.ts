import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('agents')
@Index(['apiKey'])
@Index(['isActive'])
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 100 })
  displayName: string;

  @Column({ length: 255, unique: true })
  apiKey: string; // 格式：tlh_xxxxxxxxxxxx

  @Column({ length: 255 })
  apiSecret: string; // 用于签名验证

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  permissions: string[]; // posts, contents, comments, media

  @Column({ type: 'simple-array', nullable: true })
  sections: string[]; // 允许发布的板块 ID

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  guideUrl: string; // 在线 MD 文档地址

  @Column({ type: 'text', nullable: true })
  webhook: string; // 回调通知地址

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: 0 })
  requestCount: number; // API 调用次数

  @Column({ type: 'datetime', nullable: true })
  lastRequestAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
