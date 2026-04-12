import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsOptionStringParam } from 'src/core/decorators';
import { BaseQueryParamsDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import { UsersSortBy } from '../../../dto/contracts/user.dto';

export class GetUsersQueryDto extends BaseQueryParamsDto {
  @ApiPropertyOptional({
    description: 'Filter users by login',
    example: 'admin',
    type: String,
    nullable: true,
  })
  @IsOptionStringParam()
  searchLoginTerm: Nullable<string> = null;

  @ApiPropertyOptional({
    description: 'Filter users by email address',
    example: 'admin@example.com',
    type: String,
    nullable: true,
  })
  @IsOptionStringParam()
  searchEmailTerm: Nullable<string> = null;

  @ApiProperty({
    description: 'Field to sort users by',
    example: 'createdAt',
    enum: UsersSortBy,
    enumName: 'UsersSortBy',
  })
  @IsEnum(UsersSortBy)
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;
}
