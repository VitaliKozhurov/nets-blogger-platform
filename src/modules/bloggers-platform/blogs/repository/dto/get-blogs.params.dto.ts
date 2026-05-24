import { SortDirection } from 'src/core/dto';
import { BlogsSortBy } from '../../domain/dto';

export interface IGetBlogsParamsDto {
  searchNameTerm: string | null;
  sortBy: BlogsSortBy;
  sortDirection: SortDirection;
  limit: number;
  offset: number;
}
