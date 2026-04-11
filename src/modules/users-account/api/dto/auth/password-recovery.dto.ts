import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { EMAIL_REGEX } from 'src/modules/users-account/constants/regex';

export class PasswordRecoveryRequestDto {
  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @Matches(EMAIL_REGEX)
  email: string;
}
