import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './auth/api/auth.controller';
import { TokenService } from './auth/application/services/token.service';
import { LoginUseCase } from './auth/application/use-cases/login.usecase';
import { LogoutUseCase } from './auth/application/use-cases/logout.usecase';
import { NewUserPasswordUseCase } from './auth/application/use-cases/new-user-password.usecase';
import { PasswordRecoveryUseCase } from './auth/application/use-cases/password-recovery.usecase';
import { RefreshTokenUseCase } from './auth/application/use-cases/refresh-token.usecase';
import { RegistrationConfirmationUseCase } from './auth/application/use-cases/registration-confirmation.usecase';
import { RegistrationEmailResendingUseCase } from './auth/application/use-cases/registration-email-resending.usecase';
import { RegistrationUseCase } from './auth/application/use-cases/registration.usecase';
import { jwtConfigProviders } from './config/jwt-config.provider';
import { UsersAccountConfig } from './config/users-account-config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/injection-tokens';
import { BearerAuthGuard } from './auth/guards/bearer-auth/bearer-auth.guard';
import { DeviceSessionController } from './device-session/api/device-session.controller';
import { GetDeviceSessionsHandler } from './device-session/application/queries/get-device-session.query-handler';
import { DeleteAllDeviceSessionsExceptCurrentUseCase } from './device-session/application/use-cases/delete-all-device-sessions-except-current.usecase';
import { DeleteCurrentDeviceSessionUseCase } from './device-session/application/use-cases/delete-current-device-session.usecase';
import { DeviceSessionsQueryRepository } from './device-session/repository/device-sessions-query.repository';
import { DeviceSessionsRepository } from './device-session/repository/device-sessions.repository';
import { UsersController } from './users/api/users.controller';
import { UsersFactory } from './users/application/factories/users.factory';
import { GetUsersHandler } from './users/application/queries/get-users.query-handler';
import { UsersService } from './users/application/services/users.service';
import { CreateUserByAdminUseCase } from './users/application/use-cases/create-user-by-admin.usecase';
import { DeleteUserByAdminUseCase } from './users/application/use-cases/delete-user-by-admin.usecase';
import { UsersQueryRepository } from './users/repository/users-query.repository';
import { UsersRepository } from './users/repository/users.repository';

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
  DeleteCurrentDeviceSessionUseCase,
  DeleteAllDeviceSessionsExceptCurrentUseCase,
];

const queryHandlers = [GetUsersHandler, GetDeviceSessionsHandler];

@Module({
  imports: [
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
