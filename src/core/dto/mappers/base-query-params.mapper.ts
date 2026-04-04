import { SortDirection } from '../contracts/sort-direction';

export class BaseQueryParamsMapperDto {
  pageNumber: number;
  pageSize: number;
  sortDirection: SortDirection;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
