import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryParamsDto } from 'src/core/dto/base-query-params.dto';
import { type Nullable } from 'src/core/types';
import { UsersSortBy } from '../../types/users/users-sort-by.types';

export class GetUsersQueryParamsDto extends BaseQueryParamsDto {
  @ApiPropertyOptional({
    description: 'Search by login',
    example: 'admin',
    type: String,
    nullable: true,
  })
  searchLoginTerm: Nullable<string> = null;

  @ApiPropertyOptional({
    description: 'Search by email',
    example: 'admin',
    type: String,
    nullable: true,
  })
  searchEmailTerm: Nullable<string> = null;

  @ApiProperty({
    description: 'Sort by props',
    example: 'createdAt',
    enum: UsersSortBy,
    enumName: 'Sort by options',
  })
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
