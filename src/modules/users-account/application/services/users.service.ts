import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../../domain/users/user.schema';

import { UsersRepository } from '../../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private passwordHasherService: PasswordHasherService,
    private userRepository: UsersRepository
  ) {}

  async validateUser(dto: { loginOrEmail: string; password: string }) {
    const { loginOrEmail, password } = dto;

    const user = await this.userRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const isVerifiedUser = await this.passwordHasherService.verifyPassword({
      password,
      hash: user.passwordHash,
    });

    if (!isVerifiedUser) {
      return null;
    }

    return { userId: user.id.toString(), login: user.login, email: user.email };
  }

  async checkIsUserExist(dto: {
    login: string;
    email: string;
  }): Promise<{ isExist: true; field: 'login' | 'email' } | { isExist: false }> {
    const userByLoginPromise = this.userRepository.findByLoginOrEmail(dto.login);
    const userByEmailPromise = this.userRepository.findByLoginOrEmail(dto.email);

    const [userByLogin, userByEmail] = await Promise.all([userByLoginPromise, userByEmailPromise]);

    if (userByLogin) {
      return { isExist: true, field: 'login' };
    }

    if (userByEmail) {
      return { isExist: true, field: 'email' };
    }

    return { isExist: false };
  }
}
