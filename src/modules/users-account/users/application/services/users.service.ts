import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';

import { UsersRepository } from '../../repository/users.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

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

  async ensureEmailIsAvailable(email: string): Promise<void> {
    const user = await this.userRepository.findByLoginOrEmail(email);

    if (user) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User with the given email already exists',
        extensions: [
          {
            field: 'email',
            message: 'Incorrect credentials',
          },
        ],
      });
    }
  }
}
