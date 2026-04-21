import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from 'src/core/tokens';
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
import { EnvVariables } from 'src/config/env.interface';
import { BearerAuthGuard } from './auth';

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
    UsersService,
    UsersFactory,
    UsersRepository,
    UsersQueryRepository,
    BearerAuthGuard,
    TokenService,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        const secret = configService.getOrThrow<string>(EnvVariables.JWT_ACCESS_TOKEN_SECRET);

        const expiresIn = configService.getOrThrow<number>(EnvVariables.JWT_ACCESS_TOKEN_TTL);

        return new JwtService({
          secret,
          signOptions: { expiresIn },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        const secret = configService.getOrThrow<string>(EnvVariables.JWT_REFRESH_TOKEN_SECRET);

        const expiresIn = configService.getOrThrow<number>(EnvVariables.JWT_REFRESH_TOKEN_TTL);

        return new JwtService({
          secret,
          signOptions: { expiresIn },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    BearerAuthGuard,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UsersAccountModule {}
