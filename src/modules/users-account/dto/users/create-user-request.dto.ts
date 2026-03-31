import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Create user schema', description: 'Create user body fields' })
export class CreateUserRequestDto {
  @ApiProperty({ type: String, description: 'User email', example: 'google@gmail.com' })
  email: string;
  @ApiProperty({ type: String, description: 'User login', example: 'admin' })
  login: string;
  @ApiProperty({ type: String, description: 'User password', example: 'secret_password' })
  password: string;
}
