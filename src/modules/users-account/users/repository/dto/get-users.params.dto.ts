import { SortDirection } from 'src/core/dto';
import { UsersSortBy } from '../../domain/dto';

export interface IGetUsersParamsDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UsersSortBy;
  sortDirection: SortDirection;
  limit: number;
  offset: number;
}
