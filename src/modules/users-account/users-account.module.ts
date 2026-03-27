import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordHashAdapter } from './adapters/passwordHashAdapter';
import { UsersService } from './application/users.service';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './domain/users/user.schema';
import { UsersQueryRepository } from './repository/users/users-query.repository';
import { UsersRepository } from './repository/users/users.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, PasswordHashAdapter],
  exports: [],
})
export class UsersAccountModule {}
