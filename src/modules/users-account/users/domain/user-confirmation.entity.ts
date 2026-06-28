import { BaseDBEntity } from '../../../../core/db';
import { Check, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_confirmations' })
@Check(
  'check_confirmation_values',
  '("isConfirmed" = true AND code IS NULL AND "expirationDate" IS NULL) OR ("isConfirmed" = false AND code IS NOT NULL AND "expirationDate" IS NOT NULL)'
)
export class UserConfirmationEntity extends BaseDBEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'boolean' })
  isConfirmed: boolean;

  @Column({ type: 'uuid', nullable: true })
  code: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: Date | null;

  @OneToOne(() => UserEntity, user => user.confirmation, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
