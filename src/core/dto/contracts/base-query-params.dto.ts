import { SortDirection } from './sort-direction';

export interface IBaseQueryParamsDto {
  pageNumber: number;
  pageSize: number;
  sortDirection: SortDirection;
}
