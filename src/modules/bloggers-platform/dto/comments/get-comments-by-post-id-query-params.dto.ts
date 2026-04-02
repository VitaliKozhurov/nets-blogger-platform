import { BaseQueryParamsDto } from 'src/core/dto';
import { CommentsSortBy } from '../../types/comments/comments-sort-by.types';

export class GetCommentsByPostIdQueryParamsDto extends BaseQueryParamsDto {
  sortBy: CommentsSortBy = CommentsSortBy.CreatedAt;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
