import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'key_name', unique: true })
  keyName: string;

  @Column({ name: 'key_value', type: 'text', nullable: true })
  keyValue: string;

  @Column({ name: 'value_type', default: 'string' })
  valueType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
