import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { UsersController } from './api/users.controller';
import { UsersFactory } from './application/factories/users.factory';
import { TokenService } from './application/services/token.service';
import { RegistrationUseCase } from './application/use-cases/auth/registration.usecase';
import { User, UserSchema } from './domain/users/user.schema';
import { BearerAuthGuard } from './guards/bearer-auth/bearer-auth.guard';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { RegistrationConfirmationUseCase } from './application/use-cases/auth/registration-confirmation.usecase';
import { RegistrationEmailResendingUseCase } from './application/use-cases/auth/registration-email-resending.usecase';
import { LoginUseCase } from './application/use-cases/auth/login.usecase';
import { PasswordRecoveryUseCase } from './application/use-cases/auth/password-recovery.usecase';
import { NewUserPasswordUseCase } from './application/use-cases/auth/new-user-password.usecase';
import { CreateUserByAdminUseCase } from './application/use-cases/users/create-user-by-admin.usecase';
import { UsersService } from './application/services/users.service';
import { DeleteUserByAdminUseCase } from './application/use-cases/users/delete-user-by-admin.usecase';

const commandHandlers = [
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  LoginUseCase,
  PasswordRecoveryUseCase,
  NewUserPasswordUseCase,
  CreateUserByAdminUseCase,
  DeleteUserByAdminUseCase,
];

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CryptoModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
    NotificationsModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    ...commandHandlers,
    UsersService,
    UsersFactory,
    UsersRepository,
    UsersQueryRepository,
    BearerAuthGuard,
    TokenService,
  ],
  exports: [],
})
export class UsersAccountModule {}
