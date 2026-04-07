import { DomainExceptionCode } from 'src/core/exceptions/exception.type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nullable } from 'src/core/types';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../domain/users/user.schema';

import {
  INewPasswordDto,
  IPasswordRecoveryDto,
  IRegistrationConfirmationDto,
  IRegistrationDto,
  IRegistrationEmailResendingDto,
  IUserLoginDto,
} from '../dto/contracts/auth.dto';
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

    const accessToken = await this.tokenService.createAccessToken(user);

    return { accessToken };
  }

  async registration(dto: IRegistrationDto): Promise<boolean> {
    const userExistenceCheck = await this.UserModel.checkIsUserExist(dto);

    if (userExistenceCheck.isExist) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User with the given email or login already exists',
        extensions: [{ field: userExistenceCheck.field, message: 'Incorrect credentials' }],
      });
    }

    const passwordHash = await this.passwordHasherService.createHash(dto.password);

    const createdUser = await this.UserModel.createUnconfirmedUser({
      login: dto.login,
      email: dto.email,
      passwordHash,
    });

    this.emailService.sendRegistrationConfirmationCode({
      email: dto.email,
      confirmationCode: createdUser.emailConfirmation.confirmationCode ?? '',
    });

    await this.userRepository.save(createdUser);

    return true;
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

    this.emailService.sendRegistrationConfirmationCode({
      email: dto.email,
      confirmationCode: updatedUser.emailConfirmation.confirmationCode ?? '',
    });

    await this.userRepository.save(updatedUser);

    return true;
  }

  async passwordRecovery(dto: IPasswordRecoveryDto): Promise<boolean> {
    const user = await this.userRepository.findByLoginOrEmail(dto.email);

    if (user) {
      const recoveryCode = user.setPasswordRecoverySettings();

      await this.userRepository.save(user);

      this.emailService.sendPasswordRecoveryCode({ email: dto.email, recoveryCode });

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
}
