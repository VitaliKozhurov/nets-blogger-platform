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
  LogoutUseCase,
  NewUserPasswordUseCase,
  PasswordRecoveryUseCase,
  RefreshTokenUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  RegistrationUseCase,
} from './auth/application/use-cases';
import { jwtConfigProviders } from './config/jwt-config.provider';
import { UsersAccountConfig } from './config/users-account-config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/injection-tokens';
import {
  DeviceSession,
  DeviceSessionSchema,
  DeviceSessionsQueryRepository,
  DeviceSessionsRepository,
} from './device-session';
import { DeviceSessionController } from './device-session/api';
import { GetDeviceSessionsHandler } from './device-session/application/queries';
import {
  DeleteAllMyDeviceSessionWithoutCurrentUseCase,
  DeleteMyDeviceSessionUseCase,
} from './device-session/application/use-cases';
import { UsersController } from './users/api';
import { UsersFactory } from './users/application/factories';
import { UsersService } from './users/application/services';
import { CreateUserByAdminUseCase, DeleteUserByAdminUseCase } from './users/application/use-cases';
import { User, UserSchema } from './users/domain';
import { UsersQueryRepository, UsersRepository } from './users/repository';

const commandHandlers = [
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  PasswordRecoveryUseCase,
  NewUserPasswordUseCase,
  CreateUserByAdminUseCase,
  DeleteUserByAdminUseCase,
  RefreshTokenUseCase,
  LoginUseCase,
  LogoutUseCase,
  DeleteMyDeviceSessionUseCase,
  DeleteAllMyDeviceSessionWithoutCurrentUseCase,
];

const queryHandlers = [GetDeviceSessionsHandler];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: DeviceSession.name, schema: DeviceSessionSchema }]),
    CryptoModule,
    JwtModule,
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
    NotificationsModule,
  ],
  controllers: [AuthController, UsersController, DeviceSessionController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...jwtConfigProviders,
    UsersService,
    UsersFactory,
    UsersRepository,
    UsersQueryRepository,
    BearerAuthGuard,
    TokenService,
    UsersAccountConfig,
    DeviceSessionsRepository,
    DeviceSessionsQueryRepository,
  ],
  exports: [
    BearerAuthGuard,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UsersAccountModule {}
