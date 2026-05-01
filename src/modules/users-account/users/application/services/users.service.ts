import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
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

  async ensureEmailIsAvailable(email: string): Promise<void> {
    const user = await this.usersRepository.findByLoginOrEmail(email);

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

  async ensureUserIsAvailable({ login, email }: { login: string; email: string }): Promise<void> {
    const userByLoginPromise = this.usersRepository.findByLoginOrEmail(login);
    const userByEmailPromise = this.usersRepository.findByLoginOrEmail(email);

    const [userByLogin, userByEmail] = await Promise.all([userByLoginPromise, userByEmailPromise]);

    const takenFields = [
      { field: 'login', isExist: userByLogin },
      { field: 'email', isExist: userByEmail },
    ].filter(el => Boolean(el.isExist));

    if (takenFields.length > 0) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User with this login or email already exists',
        extensions: takenFields.map(el => ({
          field: el.field,
          message: `${el.field} is already taken`,
        })),
      });
    }
  }
}
