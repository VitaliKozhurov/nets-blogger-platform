import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from 'src/core/types';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../domain/users/user.schema';
import { LoginUserRequestDto } from '../dto/auth/login-request.dto';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private passwordHasherService: PasswordHasherService,
    private userRepository: UsersRepository
  ) {}

  async validateUser(
    dto: LoginUserRequestDto
  ): Promise<Nullable<{ userId: string; login: string }>> {
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

    return { userId: user._id.toString(), login: user.login };
  }
}
