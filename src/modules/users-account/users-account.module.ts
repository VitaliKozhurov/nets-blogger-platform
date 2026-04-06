import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './application/users.service';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './domain/users/user.schema';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { CryptoModule } from '../crypto/crypto.module';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { BearerAuthGuard } from './guards/bearer-auth/bearer-auth.guard';
import { TokenService } from './application/token.service';
import { AuthService } from './application/auth.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CryptoModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    UsersService,
    AuthService,
    UsersRepository,
    UsersQueryRepository,
    BearerAuthGuard,
    TokenService,

    // {
    //   provide: APP_GUARD, // ← ДОБАВИТЬ ЭТО
    //   useClass: ThrottlerGuard, // ← ДОБАВИТЬ ЭТО
    // },
  ],
  exports: [],
})
export class UsersAccountModule {}
