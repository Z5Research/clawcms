import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ length: 50 })
  @Index()
  action: string;

  @Column({ name: 'entity_type', length: 50 })
  @Index()
  entityType: string;

  @Column({ name: 'entity_id', nullable: true })
  @Index()
  entityId: string;

  @Column({ name: 'old_values', type: 'simple-json', nullable: true })
  oldValues: Record<string, any>;

  @Column({ name: 'new_values', type: 'simple-json', nullable: true })
  newValues: Record<string, any>;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
