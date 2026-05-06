import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    type: String,
    description: 'Unique user identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Unique username used for authentication',
    example: 'john_doe',
  })
  login: string;

  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Account creation timestamp',
    example: '2026-03-31T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: string;
}

export interface IUserResponseDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
