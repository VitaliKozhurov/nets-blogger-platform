import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { PasswordHashAdapter } from '../adapters/passwordHashAdapter';
import { User } from '../domain/users/user.schema';
import { type UserModelType } from '../domain/users/user.types';
import { UsersRepository } from '../repository/users/users.repository';
import { CreateUserRequestDto } from '../dto/users/create-user-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private userRepository: UsersRepository,
    private passwordHashAdapter: PasswordHashAdapter
  ) {}

  async create(dto: CreateUserRequestDto) {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHashAdapter.createHash(password);

    const newUser = this.UserModel.createInstance({ login, email, passwordHash });

    await this.userRepository.save(newUser);

    return newUser._id.toString();
  }

  async delete(id: string) {
    const user = await this.userRepository.findByIdOrThrow(id);

    user.softDelete();

    await this.userRepository.save(user);
  }
}
