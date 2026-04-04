import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { BaseQueryParamsDocumentationDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import {
  ICreateUserDto,
  IGetUsersQueryParamsDto,
  IUserResponseDto,
  UsersSortBy,
} from '../contracts/user.dto';

@ApiSchema({ name: 'Create user schema', description: 'Create user body fields' })
export class CreateUserDocumentationDto implements ICreateUserDto {
  @ApiProperty({ type: String, description: 'User login', example: 'admin' })
  login: string;

  @ApiProperty({ type: String, description: 'User password', example: 'secret_password' })
  password: string;

  @ApiProperty({ type: String, description: 'User email', example: 'google@gmail.com' })
  email: string;
}

export class GetUsersQueryParamsDocumentationDto
  extends BaseQueryParamsDocumentationDto
  implements IGetUsersQueryParamsDto
{
  @ApiPropertyOptional({
    description: 'Filter users by login',
    example: 'admin',
    type: String,
    nullable: true,
  })
  searchLoginTerm: Nullable<string>;

  @ApiPropertyOptional({
    description: 'Filter users by email address',
    example: 'admin@example.com',
    type: String,
    nullable: true,
  })
  searchEmailTerm: Nullable<string>;

  @ApiProperty({
    description: 'Field to sort users by',
    example: 'createdAt',
    enum: UsersSortBy,
    enumName: 'UsersSortBy',
  })
  sortBy: UsersSortBy;
}

export class UserResponseDocumentationDto implements IUserResponseDto {
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
