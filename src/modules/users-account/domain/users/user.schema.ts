import { CreateUserInstanceDto } from '../../dto/users/create-user-instance.dto';
import { EmailConfirmation, EmailConfirmationSchema } from './email-confirmation.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: EmailConfirmationSchema, required: true })
  emailConfirmation: EmailConfirmation;

  createdAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

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

  return user;
});

UserSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});
