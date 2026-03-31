import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryParamsDto } from 'src/core/dto/base-query-params.dto';
import { type Nullable } from 'src/core/types';
import { UsersSortBy } from '../../types/users/users-sort-by.types';

export class GetUsersQueryParamsDto extends BaseQueryParamsDto {
  @ApiPropertyOptional({
    description: 'Filter users by login',
    example: 'admin',
    type: String,
    nullable: true,
  })
  searchLoginTerm: Nullable<string> = null;

  @ApiPropertyOptional({
    description: 'Filter users by email address',
    example: 'admin@example.com',
    type: String,
    nullable: true,
  })
  searchEmailTerm: Nullable<string> = null;

  @ApiProperty({
    description: 'Field to sort users by',
    example: 'createdAt',
    enum: UsersSortBy,
    enumName: 'UsersSortBy',
  })
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
