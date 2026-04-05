import { DomainExceptionCode } from 'src/core/exceptions/exception.type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from 'src/core/types';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../domain/users/user.schema';

import { IUserLoginDto } from '../dto/contracts/auth.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { DomainException } from 'src/core/exceptions';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private passwordHasherService: PasswordHasherService,
    private userRepository: UsersRepository,
    private tokenService: TokenService
  ) {}

  async login(dto: IUserLoginDto): Promise<Nullable<{ accessToken: string }>> {
    const user = await this.validateUser(dto);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    const accessToken = await this.tokenService.createAccessToken({
      userId: user.userId,
      login: user.login,
    });

    return { accessToken };
  }

  private async validateUser(dto: { loginOrEmail: string; password: string }) {
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

    return { userId: user.id.toString(), login: user.login };
  }
}
