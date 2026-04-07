import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EmailConfirmation, EmailConfirmationSchema } from './email-confirmation.schema';
import { CreateUserInstanceDto } from './user.dto';
import { PasswordRecovery, PasswordRecoverySchema } from './password-recovery.schema';
import { randomUUID } from 'crypto';

@Schema({ timestamps: true, versionKey: false })
export class User {
  id: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: EmailConfirmationSchema, required: true })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecoverySchema, required: true })
  passwordRecovery: PasswordRecovery;

  createdAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toString();
});

UserSchema.static('createInstance', async function (dto: CreateUserInstanceDto) {
  const user = new this();

  user.login = dto.login;
  user.email = dto.email;
  user.passwordHash = dto.passwordHash;
  user.emailConfirmation = {
    isConfirmed: true,
    confirmationCode: null,
    expirationDate: null,
  };
  user.passwordRecovery = {
    code: null,
    expirationDate: null,
  };
  user.deletedAt = null;

  return user;
});

UserSchema.static('checkIsUserExist', async function async(dto: { login: string; email: string }) {
  const userByLoginPromise = this.findOne({ deletedAt: null, login: dto.login });
  const userByEmailPromise = this.findOne({ deletedAt: null, email: dto.email });

  const [userByLogin, userByEmail] = await Promise.all([userByLoginPromise, userByEmailPromise]);

  if (userByLogin) {
    return { isExist: true, field: 'login' };
  }

  if (userByEmail) {
    return { isExist: true, field: 'email' };
  }

  return { isExist: false };
});

UserSchema.static('createUnconfirmedUser', async function (dto: CreateUserInstanceDto) {
  const user = new this();
  const expirationDate = new Date();

  expirationDate.setHours(expirationDate.getHours() + 1);
  const confirmationCode = randomUUID();

  user.login = dto.login;
  user.email = dto.email;
  user.passwordHash = dto.passwordHash;
  user.emailConfirmation = {
    isConfirmed: false,
    confirmationCode,
    expirationDate,
  };
  user.passwordRecovery = {
    code: null,
    expirationDate: null,
  };
  user.deletedAt = null;

  return user;
});

UserSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});

UserSchema.method('setPasswordRecoverySettings', function () {
  const expirationDate = new Date();

  expirationDate.setHours(expirationDate.getHours() + 1);

  const code = randomUUID();

  this.passwordRecovery.code = code;
  this.passwordRecovery.expirationDate = expirationDate;

  return code;
});

UserSchema.method('validatePasswordRecoveryCode', function (recoveryCode: string) {
  const { code, expirationDate } = this.passwordRecovery;

  if (!code || code !== recoveryCode) {
    return false;
  }

  if (!expirationDate || expirationDate < new Date()) {
    return false;
  }

  return true;
});

UserSchema.method('updatePassword', function (newPasswordHash: string) {
  this.passwordHash = newPasswordHash;
  this.passwordRecovery.code = null;
  this.passwordRecovery.expirationDate = null;

  return this;
});

UserSchema.method('validateRegistrationConfirmationCode', function (code: string) {
  const { isConfirmed, confirmationCode, expirationDate } = this.emailConfirmation;

  if (isConfirmed || !confirmationCode || confirmationCode !== code) {
    return false;
  }

  if (!expirationDate || expirationDate < new Date()) {
    return false;
  }

  return true;
});

UserSchema.method('confirmRegistration', function () {
  this.emailConfirmation.isConfirmed = true;
  this.emailConfirmation.confirmationCode = null;
  this.emailConfirmation.expirationDate = null;

  return this;
});

UserSchema.method('updateRegistrationConfirmationCode', function () {
  const confirmationCode = randomUUID();
  const expirationDate = new Date();

  expirationDate.setHours(expirationDate.getHours() + 1);

  this.emailConfirmation.confirmationCode = confirmationCode;
  this.emailConfirmation.expirationDate = expirationDate;

  return this;
});
