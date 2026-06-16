import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_password_recovery_codes' })
export class UserPasswordRecoveryEntity {
  @Column({ type: 'uuid', primary: true })
  userId: string;

  @Column({ type: 'uuid' })
  code: string;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: Date;

  @OneToOne(() => UserEntity, user => user.passwordRecovery, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
