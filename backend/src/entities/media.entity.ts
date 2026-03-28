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
import { User } from './user.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Index()
  filename: string;

  @Column({ name: 'original_filename', nullable: true })
  originalFilename: string;

  @Column()
  url: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'file_type' })
  @Index()
  fileType: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ name: 'alt_text', nullable: true })
  altText: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploader_id' })
  @Index()
  uploader: User;

  @Column({ name: 'uploader_id', nullable: true })
  uploaderId: string;

  @Column({ name: 'folder_path', nullable: true })
  @Index()
  folderPath: string;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @Column({ name: 'download_count', default: 0 })
  downloadCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
