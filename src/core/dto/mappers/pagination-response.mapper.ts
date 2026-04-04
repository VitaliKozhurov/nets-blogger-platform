import { IPaginationResponseDto } from '../contracts/pagination-response.dto';

export class PaginationResponseMapperDto<T> implements IPaginationResponseDto<T> {
  items: T;
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;

  static mapToViewModel<T>(data: {
    items: T;
    page: number;
    size: number;
    totalCount: number;
  }): PaginationResponseMapperDto<T> {
    return {
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / data.size),
      page: data.page,
      pageSize: data.size,
      items: data.items,
    };
  }
}
