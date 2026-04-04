import { SortDirection } from './sort-direction';

export class IBaseQueryParamsDto {
  pageNumber: number;
  pageSize: number;
  sortDirection: SortDirection;
}
