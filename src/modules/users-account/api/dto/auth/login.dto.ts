import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    type: String,
    description: 'User login or email address',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @ApiProperty({
    type: String,
    description: 'User account password',
    example: 'P@ssw0rd123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    type: String,
    description: 'JWT access token for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
