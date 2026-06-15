import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';

import { UsersRepository } from '../../repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private passwordHasherService: PasswordHasherService,
    private usersRepository: UsersRepository
  ) {}

  async validateUser(dto: { loginOrEmail: string; password: string }) {
    const { loginOrEmail, password } = dto;

    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

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
}
