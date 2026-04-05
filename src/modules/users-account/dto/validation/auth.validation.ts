import { IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  INewPasswordDto,
  IPasswordRecoveryDto,
  IRegistrationConfirmationDto,
  IRegistrationDto,
  IRegistrationEmailResendingDto,
  IUserLoginDto,
} from '../contracts/auth.dto';
import { EMAIL_REGEX, LOGIN_REGEX } from '../../constants/regex';
import { IsStringWithTrim } from 'src/core/decorators';

export class UserLoginRequestBodyValidationDto implements IUserLoginDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;
}

export class PasswordRecoveryRequestBodyValidationDto implements IPasswordRecoveryDto {
  @Matches(EMAIL_REGEX)
  email: string;
}

export class NewPasswordRequestBodyValidationDto implements INewPasswordDto {
  @IsStringWithTrim(6, 20)
  newPassword: string;

  @IsNotEmpty()
  recoveryCode: string;
}

export class RegistrationRequestBodyValidationDto implements IRegistrationDto {
  @IsStringWithTrim(6, 20)
  @Matches(LOGIN_REGEX)
  login: string;

  @IsStringWithTrim(6, 20)
  password: string;

  @Matches(EMAIL_REGEX)
  email: string;
}

export class RegistrationConfirmationRequestBodyValidationDto implements IRegistrationConfirmationDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class RegistrationEmailResendingRequestBodyValidationDto implements IRegistrationEmailResendingDto {
  @Matches(EMAIL_REGEX)
  email: string;
}
