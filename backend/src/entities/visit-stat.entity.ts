import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Page } from './page.entity';
import { Content } from './content.entity';

@Entity('visit_stats')
export class VisitStat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: 'post_id' })
  @Index()
  post: Post;

  @Column({ name: 'post_id', nullable: true })
  postId: string;

  @ManyToOne(() => Page, { nullable: true })
  @JoinColumn({ name: 'page_id' })
  page: Page;

  @Column({ name: 'page_id', nullable: true })
  pageId: string;

  @ManyToOne(() => Content, { nullable: true })
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @Column({ name: 'content_id', nullable: true })
  contentId: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  referer: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @CreateDateColumn()
  @Index()
  visitedAt: Date;
}
