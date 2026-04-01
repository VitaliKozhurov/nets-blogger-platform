import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'User login schema', description: 'Login user fields' })
export class LoginUserRequestDto {
  @ApiProperty({ type: String, description: 'User login or email', example: 'google@gmail.com' })
  loginOrEmail: string;

  @ApiProperty({ type: String, description: 'User password', example: 'secret_password' })
  password: string;
}
