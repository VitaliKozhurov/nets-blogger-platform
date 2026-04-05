import { ApiProperty } from '@nestjs/swagger';
import {
  INewPasswordDto,
  IPasswordRecoveryDto,
  IRegistrationConfirmationDto,
  IRegistrationDto,
  IRegistrationEmailResendingDto,
  IUserLoginDto,
} from '../contracts/auth.dto';
import { EMAIL_REGEX, LOGIN_REGEX } from '../../constants/regex';

export class UserLoginDocumentationDto implements IUserLoginDto {
  @ApiProperty({
    type: String,
    description: 'User login or email address',
    example: 'john_doe',
  })
  loginOrEmail: string;

  @ApiProperty({
    type: String,
    description: 'User account password',
    example: 'P@ssw0rd123!',
  })
  password: string;
}

export class UserLoginResponseDocumentationDto {
  @ApiProperty({
    type: String,
    description: 'JWT access token for authenticated requests',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2RmODQxMjM0YzVkNTY3ODkwYWJjZGUiLCJpYXQiOjE3NDM4MjQwMDAsImV4cCI6MTc0MzgyNDkwMH0.abc123def456ghi789jkl',
  })
  accessToken: string;
}

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

export class RegistrationDocumentationDto implements IRegistrationDto {
  @ApiProperty({
    type: String,
    description: 'User login (unique username)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 10,
    pattern: `${LOGIN_REGEX}`,
  })
  login: string;

  @ApiProperty({
    type: String,
    description: 'User password (must meet security requirements)',
    example: 'P@ssw0rd123!',
    minLength: 6,
    maxLength: 20,
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'User email address (used for registration confirmation)',
    example: 'user@example.com',
    pattern: `${EMAIL_REGEX}`,
  })
  email: string;
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
