import { BaseQueryParamsDto } from 'src/core/dto/base-query-params.dto';
import { Nullable } from 'src/core/types';
import { UsersSortBy } from '../../types/users/users-sort-by.types';

export class GetUsersQueryParamsDto extends BaseQueryParamsDto {
  searchLoginTerm: Nullable<string> = null;
  searchEmailTerm: Nullable<string> = null;
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
