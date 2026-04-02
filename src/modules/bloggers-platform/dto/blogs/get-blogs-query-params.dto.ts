import { BaseQueryParamsDto } from 'src/core/dto';
import { Nullable } from 'src/core/types';
import { BlogsSortBy } from '../../types/blogs/blogs-sort-by.types';

export class GetBlogsQueryParamsDto extends BaseQueryParamsDto {
  searchNameTerm: Nullable<string> = null;
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
