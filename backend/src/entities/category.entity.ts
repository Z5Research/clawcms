import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Section } from './section.entity';
import { Post } from './post.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  @Index()
  slug: string;

  @ManyToOne(() => Section, { eager: true })
  @JoinColumn({ name: 'section_id' })
  @Index()
  section: Section;

  @Column({ name: 'section_id' })
  sectionId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  @Index()
  parent: Category;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;
}
