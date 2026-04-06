import { DomainExceptionCode } from 'src/core/exceptions/exception.type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from 'src/core/types';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../domain/users/user.schema';

import { IPasswordRecoveryDto, IRegistrationDto, IUserLoginDto } from '../dto/contracts/auth.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { DomainException } from 'src/core/exceptions';
import { TokenService } from './token.service';
import { EmailService } from 'src/modules/notifications/email.service';
import { type UserModelType } from '../domain/users/user.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private passwordHasherService: PasswordHasherService,
    private userRepository: UsersRepository,
    private tokenService: TokenService,
    private emailService: EmailService
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

  async registration(dto: IRegistrationDto) {
    const userExistenceCheck = await this.UserModel.checkIsUserExist(dto);

    if (userExistenceCheck.isExist) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User with the given email or login already exists',
        extensions: [{ field: userExistenceCheck.field, message: 'Incorrect credentials' }],
      });
    }

    // TODO add logic for creating user without confirmation !!!
  }

  async passwordRecovery(dto: IPasswordRecoveryDto): Promise<boolean> {
    const user = await this.userRepository.findByLoginOrEmail(dto.email);

    if (user) {
      const code = user.setPasswordRecoverySettings();

      await this.userRepository.save(user);

      this.emailService
        .sendConfirmationCode({ email: dto.email, code })
        .catch(err => console.log(err));

      return true;
    }

    return false;
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
