import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BearerAuthGuard } from './auth';
import { AuthController } from './auth/api';
import { TokenService } from './auth/application/services';
import {
  LoginUseCase,
  NewUserPasswordUseCase,
  PasswordRecoveryUseCase,
  RefreshTokenUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  RegistrationUseCase,
} from './auth/application/use-cases';
import { UsersAccountConfig } from './config/users-account-config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/injection-tokens';
import { jwtConfigProviders } from './config/jwt-config.provider';
import { UsersController } from './users/api';
import { UsersFactory } from './users/application/factories';
import { UsersService } from './users/application/services';
import { CreateUserByAdminUseCase, DeleteUserByAdminUseCase } from './users/application/use-cases';
import { User, UserSchema } from './users/domain';
import { UsersQueryRepository, UsersRepository } from './users/repository';
import { DeviceSession, DeviceSessionSchema, DeviceSessionsRepository } from './device-session';

const commandHandlers = [
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  LoginUseCase,
  PasswordRecoveryUseCase,
  NewUserPasswordUseCase,
  CreateUserByAdminUseCase,
  DeleteUserByAdminUseCase,
  RefreshTokenUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: DeviceSession.name, schema: DeviceSessionSchema }]),
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
    DeviceSessionsRepository,
  ],
  exports: [
    BearerAuthGuard,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UsersAccountModule {}
