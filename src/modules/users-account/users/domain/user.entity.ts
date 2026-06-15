import { BaseDBEntity } from 'src/core/db';
import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm';
import { ICreateVerifiedUserDto } from './dto/create-verified-user.dto';
import { UserConfirmationEntity } from './user-confirmation.entity';
import { ICreateUnverifiedUserDto } from './dto/create-unverified-user.dto';
import { UserPasswordRecoveryEntity } from './user-password-recovery.entity';
import { randomUUID } from 'crypto';

@Entity({ name: 'users' })
@Unique('UQ_USER_LOGIN', ['login'])
@Unique('UQ_USER_EMAIL', ['email'])
export class UserEntity extends BaseDBEntity {
  @Column({ type: 'varchar', length: 50 })
  login: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @OneToOne(() => UserConfirmationEntity, confirmation => confirmation.user, {
    cascade: true, // для сохранения связанных сущностей
  })
  confirmation: UserConfirmationEntity;

  @OneToMany(() => UserPasswordRecoveryEntity, recoveryCodes => recoveryCodes.user, {
    cascade: true, // для сохранения связанных сущностей
  })
  recoveryCodes: UserPasswordRecoveryEntity[];

  static createVerifiedUser(dto: ICreateVerifiedUserDto) {
    const newUser = new UserEntity();

    newUser.login = dto.login;
    newUser.passwordHash = dto.passwordHash;
    newUser.email = dto.email;

    const confirmation = new UserConfirmationEntity();

    confirmation.isConfirmed = true;
    confirmation.code = null;
    confirmation.expirationDate = null;
    confirmation.user = newUser;

    newUser.confirmation = confirmation;

    return newUser;
  }

  static createUnverifiedUser(dto: ICreateUnverifiedUserDto) {
    const newUser = new UserEntity();
    const confirmationCode = randomUUID();

    newUser.login = dto.login;
    newUser.passwordHash = dto.passwordHash;
    newUser.email = dto.email;

    const confirmation = new UserConfirmationEntity();

    confirmation.isConfirmed = false;
    confirmation.code = confirmationCode;
    confirmation.expirationDate = new Date(Date.now() + 60 * 60 * 1000);
    confirmation.user = newUser;

    newUser.confirmation = confirmation;

    return newUser;
  }
}
