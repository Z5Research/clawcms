import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, { eager: true })
  @JoinColumn({ name: 'post_id' })
  @Index()
  post: Post;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  // 嵌套评论
  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  @Index()
  parent: Comment;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  // 游客评论支持
  @Column({ name: 'guest_name', nullable: true })
  guestName: string;

  @Column({ name: 'guest_email', nullable: true })
  guestEmail: string;

  @Column({ name: 'guest_website', nullable: true })
  guestWebsite: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 20, default: 'pending' })
  @Index()
  status: CommentStatus;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
