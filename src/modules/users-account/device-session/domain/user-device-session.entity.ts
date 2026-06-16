import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'device_session' })
export class UserDeviceSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  deviceId: string;

  @Column('text')
  deviceName: string;

  @Column({ type: 'varchar', length: 50 })
  ip: string;

  @Column('bigint')
  iat: number;

  @Column('bigint')
  expirationAt: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
