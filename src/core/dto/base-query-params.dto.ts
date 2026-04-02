import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class BaseQueryParamsDto {
  @ApiProperty({
    type: Number,
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  pageNumber: number = 1;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  pageSize: number = 10;

  @ApiProperty({
    description: 'Sort order direction',
    example: 'desc',
    enum: SortDirection,
    enumName: 'SortDirection',
    default: SortDirection.Desc,
  })
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
