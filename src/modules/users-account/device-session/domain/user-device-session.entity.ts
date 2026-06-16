import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ICreateSessionDto } from './dto/create-session.dto';

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

  static createNewSession(dto: ICreateSessionDto) {
    const newSession = new UserDeviceSessionEntity();

    newSession.userId = dto.userId;
    newSession.deviceId = dto.deviceId;
    newSession.ip = dto.ip;
    newSession.deviceName = dto.deviceName;
    newSession.iat = dto.iat;
    newSession.expirationAt = dto.expirationAt;

    return newSession;
  }
}
