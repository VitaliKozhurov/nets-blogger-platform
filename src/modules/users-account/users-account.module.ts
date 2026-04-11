import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoModule } from '../crypto/crypto.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersFactory } from './application/factories/users.factory';
import { TokenService } from './application/token.service';
import { RegistrationUserUseCase } from './application/use-cases/registration-user.usecase';
import { UsersService } from './application/users.service';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './domain/users/user.schema';
import { BearerAuthGuard } from './guards/bearer-auth/bearer-auth.guard';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { UsersRepository } from './infrastructure/users.repository';

const commandHandlers = [RegistrationUserUseCase];

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
