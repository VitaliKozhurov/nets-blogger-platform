import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainExceptionCode } from 'src/core/exceptions/exception.type';
import { Nullable } from 'src/core/types';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../domain/users/user.schema';

import { DomainException } from 'src/core/exceptions';
import {
  INewPasswordDto,
  IPasswordRecoveryDto,
  IRegistrationConfirmationDto,
  IRegistrationEmailResendingDto,
  IUserLoginDto,
} from '../dto/contracts/auth.dto';
import { UsersRepository } from '../infrastructure/users.repository';
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

    const accessToken = await this.tokenService.createAccessToken(user);

    return { accessToken };
  }

  async registrationConfirmation(dto: IRegistrationConfirmationDto): Promise<boolean> {
    const user = await this.userRepository.findByRegistrationConfirmationCode(dto.code);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Confirmation code is invalid',
        extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
      });
    }

    const isValidCode = user.validateRegistrationConfirmationCode(dto.code);

    if (!isValidCode) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Confirmation code is invalid',
        extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
      });
    }

    const updatedUser = user.confirmRegistration();

    await this.userRepository.save(updatedUser);

    return true;
  }

  async registrationEmailResending(dto: IRegistrationEmailResendingDto): Promise<boolean> {
    const user = await this.userRepository.findByLoginOrEmail(dto.email);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Email is invalid',
        extensions: [{ field: 'email', message: 'Invalid email' }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User is confirmed',
        extensions: [{ field: 'email', message: 'User is confirmed' }],
      });
    }

    const updatedUser = user.updateRegistrationConfirmationCode();

    // this.emailService.sendRegistrationConfirmationCode({
    //   email: dto.email,
    //   confirmationCode: updatedUser.emailConfirmation.confirmationCode ?? '',
    // });

    await this.userRepository.save(updatedUser);

    return true;
  }

  async passwordRecovery(dto: IPasswordRecoveryDto): Promise<boolean> {
    const user = await this.userRepository.findByLoginOrEmail(dto.email);

    if (user) {
      // const recoveryCode = user.setPasswordRecoverySettings();

      await this.userRepository.save(user);

      // this.emailService.sendPasswordRecoveryCode({ email: dto.email, recoveryCode });

      return true;
    }

    return false;
  }

  async newPassword(dto: INewPasswordDto): Promise<boolean> {
    const user = await this.userRepository.findByPasswordRecoveryCode(dto.recoveryCode);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Recovery code is invalid',
        extensions: [{ field: 'recoveryCode', message: 'Invalid recovery code' }],
      });
    }

    const isValidCode = user.validatePasswordRecoveryCode(dto.recoveryCode);

    if (!isValidCode) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Recovery code is expired or invalid',
        extensions: [{ field: 'recoveryCode', message: 'Recovery code has expired' }],
      });
    }

    const passwordHash = await this.passwordHasherService.createHash(dto.newPassword);

    const updatedUser = user.updatePassword(passwordHash);

    await this.userRepository.save(updatedUser);

    return true;
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
