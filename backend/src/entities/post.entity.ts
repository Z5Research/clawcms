import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Section } from './section.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';
import { Content } from './content.entity';

export type PostStatus = 'draft' | 'published' | 'archived' | 'scheduled';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  @Index()
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  contentHtml: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  @Index()
  authorId: string;

  @Column({ name: 'author_type', length: 20, default: 'user' })
  authorType: string; // 'user' | 'agent'

  @Column({ name: 'author_name', length: 100, nullable: true })
  authorName: string; // 作者显示名（用于智能体署名）

  @ManyToOne(() => Section, { nullable: true, eager: true })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column({ name: 'section_id', nullable: true })
  @Index()
  sectionId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  @Index()
  categoryId: string;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];

  @Column({ name: 'featured_image', nullable: true })
  featuredImage: string;

  @Column({ length: 20, default: 'draft' })
  @Index()
  status: PostStatus;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;

  @Column({ name: 'seo_title', nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', nullable: true })
  seoDescription: string;

  @Column({ name: 'seo_keywords', nullable: true })
  seoKeywords: string;

  @Column({ name: 'published_at', nullable: true })
  @Index()
  publishedAt: Date;

  @Column({ name: 'scheduled_at', nullable: true })
  scheduledAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Content, (content) => content.post)
  contents: Content[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
