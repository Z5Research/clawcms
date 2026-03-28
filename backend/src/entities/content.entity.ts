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
import { Section } from './section.entity';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  @Index()
  slug: string;

  // 内容存储（支持多格式）
  @Column({ name: 'content_markdown', type: 'text', nullable: true })
  contentMarkdown: string;

  @Column({ name: 'content_html', type: 'text', nullable: true })
  contentHtml: string;

  @Column({ name: 'content_json', type: 'simple-json', nullable: true })
  contentJson: Record<string, any>;

  // 样式定制
  @Column({ name: 'custom_css', type: 'text', nullable: true })
  customCss: string;

  @Column({ name: 'custom_js', type: 'text', nullable: true })
  customJs: string;

  // 模板
  @Column({ default: 'default' })
  template: string;

  // SEO
  @Column({ name: 'featured_image', nullable: true })
  featuredImage: string;

  @Column({ name: 'seo_title', nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', nullable: true })
  seoDescription: string;

  // 发布
  @Column({ name: 'is_published', default: false })
  @Index()
  isPublished: boolean;

  @Column({ name: 'published_at', nullable: true })
  publishedAt: Date;

  // 关联
  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: 'post_id' })
  @Index()
  post: Post;

  @Column({ name: 'post_id', nullable: true })
  postId: string;

  @ManyToOne(() => Section, { nullable: true })
  @JoinColumn({ name: 'section_id' })
  @Index()
  section: Section;

  @Column({ name: 'section_id', nullable: true })
  sectionId: string;

  // 版本控制
  @Column({ default: 1 })
  version: number;

  @Column({ name: 'parent_content_id', nullable: true })
  parentContentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
