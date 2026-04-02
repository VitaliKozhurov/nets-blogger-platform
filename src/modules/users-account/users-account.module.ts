import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './application/users.service';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './domain/users/user.schema';
import { UsersQueryRepository } from './infrastructure/users/users-query.repository';
import { UsersRepository } from './infrastructure/users/users.repository';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), CryptoModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  exports: [],
})
export class UsersAccountModule {}
