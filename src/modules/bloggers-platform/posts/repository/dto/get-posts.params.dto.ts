import { SortDirection } from 'src/core/dto';
import { PostsSortBy } from '../../domain/dto';

export interface IGetPostsParamsDto {
  blogId: string;
  userId: string | undefined;
  query: {
    sortBy: PostsSortBy;
    sortDirection: SortDirection;
    limit: number;
    offset: number;
  };
}
