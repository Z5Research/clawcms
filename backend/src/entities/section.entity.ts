import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Post } from './post.entity';
import { Category } from './category.entity';
import { Content } from './content.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  @Index()
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ length: 20, default: '#1890ff' })
  color: string;

  @ManyToOne(() => Section, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Section;

  @Column({ name: 'parent_id', nullable: true })
  @Index()
  parentId: string;

  @Column({ name: 'sort_order', default: 0 })
  @Index()
  sortOrder: number;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @Column({ name: 'seo_title', nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', nullable: true })
  seoDescription: string;

  @Column({ default: 'default' })
  template: string;

  @OneToMany(() => Post, (post) => post.section)
  posts: Post[];

  @OneToMany(() => Category, (category) => category.section)
  categories: Category[];

  @OneToMany(() => Content, (content) => content.section)
  contents: Content[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
