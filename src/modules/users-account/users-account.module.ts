import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/users/user.schema';
import { UsersService } from './application/users/users.service';
import { UsersRepository } from './repository/users/users.repository';
import { UsersQueryRepository } from './repository/users/users-query.repository';
import { UsersController } from './controllers/users/users.controller';
import { PasswordHashAdapter } from './adapters/passwordHashAdapter';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, PasswordHashAdapter],
})
export class UsersAccountModule {}
