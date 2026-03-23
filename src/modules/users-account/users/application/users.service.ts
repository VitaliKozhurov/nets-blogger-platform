import { type UserModuleType } from './../domain/user.schema';
import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserRequestDto } from '../dto/create-user-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModuleType,
    private userRepository: UsersRepository
  ) {}

  async create(dto: CreateUserRequestDto) {}

  async delete(id:string) {}
}
