import { ApiProperty } from '@nestjs/swagger';
import { IPaginationResponseDto } from '../contracts/pagination-response.dto';

export class PaginationResponseDocumentationDto<T> implements IPaginationResponseDto<T> {
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
}
