import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { PasswordHashAdapter } from '../../adapters/passwordHashAdapter';
import { User } from '../../domain/users/user.schema';
import { type UserModuleType } from '../../domain/users/user.types';
import { UsersRepository } from '../../repository/users/users.repository';
import { CreateUserRequestDto } from '../../dto/users/create-user-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModuleType,
    private userRepository: UsersRepository,
    private passwordHashAdapter: PasswordHashAdapter
  ) {}

  async create(dto: CreateUserRequestDto) {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHashAdapter.createHash(password);

    const newUser = await this.UserModel.createInstance({ login, email, passwordHash });

    console.log(newUser);

    await this.userRepository.save(newUser);

    return newUser._id.toString();
  }

  async delete(id: string) {
    const user = await this.userRepository.getById(id);

    user.softDelete();

    await this.userRepository.save(user);
  }
}
