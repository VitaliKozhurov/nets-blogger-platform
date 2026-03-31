import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from '../../domain/users/user.types';

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
    // minLength: 3,
    // maxLength: 30,
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

  static mapToView(userDocument: UserDocument): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = userDocument._id.toString();
    dto.login = userDocument.login;
    dto.email = userDocument.email;
    dto.createdAt = userDocument.createdAt.toISOString();

    return dto;
  }
}
