import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  items: T;

  @ApiProperty({
    type: Number,
    description: 'Total number of items available across all pages',
  })
  totalCount: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of pages based on totalCount and pageSize',
  })
  pagesCount: number;

  @ApiProperty({
    type: Number,
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
  })
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
