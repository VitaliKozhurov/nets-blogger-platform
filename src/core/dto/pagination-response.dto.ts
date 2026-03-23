export class PaginationResponseDto<T> {
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
  }): PaginationResponseDto<T> {
    return {
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / data.size),
      page: data.page,
      pageSize: data.size,
      items: data.items,
    };
  }
}
