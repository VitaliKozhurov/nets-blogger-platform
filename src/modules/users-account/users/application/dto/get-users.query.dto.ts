import { SortDirection } from 'src/core/dto';
import { UsersSortBy } from '../../domain/dto';

export interface IGetUsersQueryDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UsersSortBy;
  pageNumber: number;
  pageSize: number;
  sortDirection: SortDirection;
}
