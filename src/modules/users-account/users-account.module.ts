import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/injection-tokens';
import { AuthController } from './auth/api';
import { UsersController } from './users/api';
import { UsersFactory } from './users/application/factories';
import { TokenService } from './auth/application/services';
import {
  LoginUseCase,
  NewUserPasswordUseCase,
  PasswordRecoveryUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  RegistrationUseCase,
} from './auth/application/use-cases';
import { CreateUserByAdminUseCase, DeleteUserByAdminUseCase } from './users/application/use-cases';
import { User, UserSchema } from './users/domain';
import { UsersQueryRepository, UsersRepository } from './users/repository';
import { UsersService } from './users/application/services';
import { BearerAuthGuard } from './auth';
import { UsersAccountConfig } from './config/users-account-config';
import { jwtConfigProviders } from './providers/jwt-config.provider';

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
    JwtModule,
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
    NotificationsModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    ...commandHandlers,
    ...jwtConfigProviders,
    UsersService,
    UsersFactory,
    UsersRepository,
    UsersQueryRepository,
    BearerAuthGuard,
    TokenService,
    UsersAccountConfig,
  ],
  exports: [
    BearerAuthGuard,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UsersAccountModule {}
