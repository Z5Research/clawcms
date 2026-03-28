import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  @Index()
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'content_html', type: 'text', nullable: true })
  contentHtml: string;

  @Column({ default: 'full-width' })
  template: string;

  @Column({ name: 'custom_css', type: 'text', nullable: true })
  customCss: string;

  @Column({ name: 'meta_title', nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', nullable: true })
  metaDescription: string;

  @Column({ name: 'meta_keywords', nullable: true })
  metaKeywords: string;

  @Column({ name: 'is_published', default: false })
  @Index()
  isPublished: boolean;

  @Column({ name: 'published_at', nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
