import { BaseQueryParamsDto } from 'src/core/dto/base-query-params.dto';
import { PostsSortBy } from '../../types/posts/posts-sort-by.types';

export class GetPostsQueryParamsDto extends BaseQueryParamsDto {
  sortBy: PostsSortBy = PostsSortBy.CreatedAt;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
