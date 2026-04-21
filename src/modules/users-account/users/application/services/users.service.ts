import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';

import { UsersRepository } from '../../repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
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
