import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators';
import { EMAIL_REGEX, LOGIN_REGEX } from 'src/modules/users-account/constants/regex';

export class CreateUserByAdminRequestDto {
  @ApiProperty({ type: String, description: 'User login', example: 'admin' })
  @IsStringWithTrim(3, 10)
  @Matches(LOGIN_REGEX)
  login: string;

  @ApiProperty({ type: String, description: 'User password', example: 'secret_password' })
  @IsStringWithTrim(6, 20)
  password: string;

  @ApiProperty({ type: String, description: 'User email', example: 'google@gmail.com' })
  @Matches(EMAIL_REGEX)
  email: string;
}
