import { ApiProperty } from '@nestjs/swagger';
import {
  INewPasswordDto,
  IPasswordRecoveryDto,
  IRegistrationConfirmationDto,
  IRegistrationEmailResendingDto,
} from '../contracts/auth.dto';

export class PasswordRecoveryDocumentationDto implements IPasswordRecoveryDto {
  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;
}

export class NewPasswordDocumentationDto implements INewPasswordDto {
  @ApiProperty({
    type: String,
    description: 'New user password (must meet security requirements)',
    example: 'NewP@ssw0rd123!',
    minLength: 6,
    maxLength: 20,
  })
  newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Password recovery code received via email',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  recoveryCode: string;
}

export class RegistrationConfirmationDocumentationDto implements IRegistrationConfirmationDto {
  @ApiProperty({
    type: String,
    description: 'Email confirmation code sent to the user during registration',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  code: string;
}

export class RegistrationEmailResendingDocumentationDto implements IRegistrationEmailResendingDto {
  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;
}

export class MeResponseDocumentationDto {
  @ApiProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: String,
  })
  login: string;

  @ApiProperty({
    type: String,
  })
  userId: string;
}
