import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Media } from './media.entity';
import { UserGroup } from './user-group.entity';

export type UserRole = 'admin' | 'editor' | 'author' | 'subscriber';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  @Index()
  username: string;

  @Column({ length: 255, unique: true })
  @Index()
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ length: 20, default: 'author' })
  @Index()
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Media, (media) => media.uploader)
  uploads: Media[];

  @ManyToMany(() => UserGroup, (group) => group.users)
  @JoinTable({
    name: 'user_group_members',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'group_id' },
  })
  groups: UserGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
