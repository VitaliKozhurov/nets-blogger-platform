import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './auth/api/auth.controller';
import { TokenService } from './auth/application/services/token.service';
import {
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  PasswordRecoveryUseCase,
  NewUserPasswordUseCase,
} from './auth/application/use-cases';
import { BearerAuthGuard } from './auth/guards/bearer-auth/bearer-auth.guard';
import { jwtConfigProviders } from './config/jwt-config.provider';
import { UsersAccountConfig } from './config/users-account-config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/injection-tokens';
import { DeviceSessionController } from './device-session/api/device-session.controller';
import { GetDeviceSessionsHandler } from './device-session/application/queries';
import {
  DeleteAllUserDeviceSessionsExceptCurrentUseCase,
  DeleteCurrentDeviceSessionUseCase,
} from './device-session/application/use-cases';
import { DeviceSessionsQueryRepository } from './device-session/repository/device-sessions-query.repository';
import { DeviceSessionsRepository } from './device-session/repository/device-sessions.repository';
import { UsersController } from './users/api/users.controller';
import { UsersFactory } from './users/application/factories/users.factory';
import { GetUsersHandler } from './users/application/queries/get-users.query-handler';
import { UsersService } from './users/application/services/users.service';
import { CreateUserUseCase, DeleteUserUseCase } from './users/application/use-cases';
import { UsersQueryRepository } from './users/repository/users-query.repository';
import { UsersRepository } from './users/repository/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/domain/user.entity';

const commandHandlers = [
  RegistrationUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  PasswordRecoveryUseCase,
  NewUserPasswordUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  RefreshTokenUseCase,
  LoginUseCase,
  LogoutUseCase,
  DeleteCurrentDeviceSessionUseCase,
  DeleteAllUserDeviceSessionsExceptCurrentUseCase,
];

const queryHandlers = [GetUsersHandler, GetDeviceSessionsHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
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
