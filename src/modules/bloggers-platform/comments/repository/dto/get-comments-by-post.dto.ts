import { SortDirection } from 'src/core/dto';
import { CommentsSortBy } from '../../domain/dto';

export interface IGetCommentsByPostParamsDto {
  postId: string;
  userId: string | undefined;
  query: {
    sortBy: CommentsSortBy;
    sortDirection: SortDirection;
    limit: number;
    offset: number;
  };
}
