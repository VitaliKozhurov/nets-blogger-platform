import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { UsersController } from './api/users.controller';
import { AuthService } from './application/auth.service';
import { UsersFactory } from './application/factories/users.factory';
import { TokenService } from './application/token.service';
import { RegistrationUseCase } from './application/use-cases/registration.usecase';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/users/user.schema';
import { BearerAuthGuard } from './guards/bearer-auth/bearer-auth.guard';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { RegistrationConfirmationUseCase } from './application/use-cases/registration-confirmation.usecase';
import { RegistrationEmailResendingUseCase } from './application/use-cases/registration-email-resending.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { PasswordRecoveryUseCase } from './application/use-cases/password-recovery.usecase';
import { NewUserPasswordUseCase } from './application/use-cases/new-user-password.usecase';

const commandHandlers = [
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  LoginUseCase,
  PasswordRecoveryUseCase,
  NewUserPasswordUseCase,
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
    AuthService,
    UsersRepository,
    UsersQueryRepository,
    BearerAuthGuard,
    TokenService,
  ],
  exports: [],
})
export class UsersAccountModule {}
