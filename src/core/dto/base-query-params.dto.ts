import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class BaseQueryParamsDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  pageNumber: number = 1;

  @ApiProperty({
    description: 'Items count per page ',
    example: 10,
    type: Number,
  })
  @Type(() => Number)
  pageSize: number = 10;

  @ApiProperty({
    description: 'Sort direction',
    example: 'desc',
    enum: SortDirection,
    enumName: 'Sorting',
  })
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
