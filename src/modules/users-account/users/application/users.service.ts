import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserRequestDto } from '../dto/create-user-request.dto';
import { PasswordHashAdapter } from '../adapters/passwordHashAdapter';
import { type UserModuleType } from '../domain/user.types';

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

    const newUser = this.UserModel.createInstance({ login, email, passwordHash });

    await this.userRepository.save(newUser);

    return newUser._id.toString();
  }

  async delete(id: string) {
    const user = await this.userRepository.getById(id);

    user.softDelete();

    await this.userRepository.save(user);
  }
}
