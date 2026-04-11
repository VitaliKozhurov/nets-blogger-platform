import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators';
import { EMAIL_REGEX } from '../../constants/regex';
import {
  INewPasswordDto,
  IPasswordRecoveryDto,
  IRegistrationConfirmationDto,
  IRegistrationEmailResendingDto,
} from '../contracts/auth.dto';

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

export class RegistrationConfirmationRequestBodyValidationDto implements IRegistrationConfirmationDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class RegistrationEmailResendingRequestBodyValidationDto implements IRegistrationEmailResendingDto {
  @Matches(EMAIL_REGEX)
  email: string;
}
