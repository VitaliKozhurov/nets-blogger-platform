import { randomUUID } from 'crypto';
import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm';
import { BaseDBEntity } from '../../../../core/db';
import { PostLikeEntity } from '../../../bloggers-platform/likes/domain/post-like.entity';
import { ICreateUnverifiedUserDto } from './dto/create-unverified-user.dto';
import { ICreateVerifiedUserDto } from './dto/create-verified-user.dto';
import { UserConfirmationEntity } from './user-confirmation.entity';
import { UserPasswordRecoveryEntity } from './user-password-recovery.entity';

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

  @OneToOne(() => UserPasswordRecoveryEntity, recoveryCodes => recoveryCodes.user, {
    cascade: true, // для сохранения связанных сущностей
    nullable: true,
  })
  passwordRecovery: UserPasswordRecoveryEntity | null;

  @OneToMany(() => PostLikeEntity, like => like.user)
  postLikes: PostLikeEntity[];

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

  checkIsConfirmed() {
    return this.confirmation.isConfirmed;
  }

  updateConfirmationCode() {
    const confirmationCode = randomUUID();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    this.confirmation.code = confirmationCode;
    this.confirmation.expirationDate = expirationDate;

    return this;
  }

  updatePassword(passwordHash: string) {
    this.passwordHash = passwordHash;

    return this;
  }

  generatePasswordRecoveryCode() {
    const passwordRecovery = new UserPasswordRecoveryEntity();
    const recoveryCode = randomUUID();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    passwordRecovery.code = recoveryCode;
    passwordRecovery.expirationDate = expirationDate;

    this.passwordRecovery = passwordRecovery;

    return this;
  }
}
