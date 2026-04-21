import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators';
import { EMAIL_REGEX, LOGIN_REGEX } from '@modules/users-account/constants';

export class RegistrationRequestDto {
  @ApiProperty({
    type: String,
    description: 'User login (unique username)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 10,
    pattern: `${LOGIN_REGEX}`,
  })
  @IsStringWithTrim(3, 10)
  @Matches(LOGIN_REGEX)
  login: string;

  @ApiProperty({
    type: String,
    description: 'User password (must meet security requirements)',
    example: 'P@ssw0rd123!',
    minLength: 6,
    maxLength: 20,
  })
  @IsStringWithTrim(6, 20)
  password: string;

  @ApiProperty({
    type: String,
    description: 'User email address (used for registration confirmation)',
    example: 'user@example.com',
    pattern: `${EMAIL_REGEX}`,
  })
  @Matches(EMAIL_REGEX)
  email: string;
}
