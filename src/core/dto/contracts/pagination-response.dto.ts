export interface IPaginationResponseDto<T> {
  items: T;
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
}
