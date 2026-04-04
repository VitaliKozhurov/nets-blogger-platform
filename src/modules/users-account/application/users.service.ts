import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { PasswordHasherService } from '../../crypto/password-hasher.service';
import { User } from '../domain/users/user.schema';
import { type UserModelType } from '../domain/users/user.types';

import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private userRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService
  ) {}

  async create(dto: CreateUserRequestDto) {
    const { login, email, password } = dto;

    console.log('DTO: ', dto);

    const passwordHash = await this.passwordHasherService.createHash(password);

    const newUser = await this.UserModel.createInstance({ login, email, passwordHash });

    await this.userRepository.save(newUser);

    return newUser._id.toString();
  }

  async delete(id: string) {
    const user = await this.userRepository.findByIdOrThrow(id);

    user.softDelete();

    await this.userRepository.save(user);
  }
}
