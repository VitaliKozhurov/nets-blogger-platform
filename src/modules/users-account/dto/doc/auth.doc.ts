import { ApiProperty } from '@nestjs/swagger';
import { IUserLoginDto } from '../contracts/auth.dto';

export class UserLoginDocumentationDto implements IUserLoginDto {
  @ApiProperty({ type: String, description: 'User login or email', example: 'google@gmail.com' })
  loginOrEmail: string;

  @ApiProperty({ type: String, description: 'User password', example: 'secret_password' })
  password: string;
}
