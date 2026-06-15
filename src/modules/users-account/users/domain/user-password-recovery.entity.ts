import { BaseDBEntity } from 'src/core/db';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_password_recovery_codes' })
export class UserPasswordRecoveryEntity extends BaseDBEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  code: string;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: Date;

  @ManyToOne(() => UserEntity, user => user.recoveryCodes, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
