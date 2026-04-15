import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { UsersController } from './api/users.controller';
import { UsersFactory } from './application/factories/users.factory';
import { TokenService } from './application/services/token.service';
import {
  CreateUserByAdminUseCase,
  DeleteUserByAdminUseCase,
  LoginUseCase,
  NewUserPasswordUseCase,
  PasswordRecoveryUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  RegistrationUseCase,
} from './application/use-cases';
import { User, UserSchema } from './domain/users/user.schema';
import { BearerAuthGuard } from './guards';
import { UsersQueryRepository, UsersRepository } from './infrastructure';
import { UsersService } from './application/services/users.service';
import { EnvVariables } from 'src/config/env.interface';

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
      provide: 'ACCESS_TOKEN_STRATEGY_INJECT_TOKEN',
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
  ],
  exports: [BearerAuthGuard],
})
export class UsersAccountModule {}

//  {
// provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
// useFactory: (): JwtService => {
//   return new JwtService({
//     secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
//     signOptions: { expiresIn: '5m' },
//   });
// },
// inject: [
//   /*TODO: inject configService. will be in the following lessons*/
// ],
//     },
