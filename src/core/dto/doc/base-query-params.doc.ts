import { ApiProperty } from '@nestjs/swagger';
import { IBaseQueryParamsDto } from '../contracts/base-query-params.dto';
import { SortDirection } from '../contracts/sort-direction';

export class BaseQueryParamsDocumentationDto implements IBaseQueryParamsDto {
  @ApiProperty({
    type: Number,
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  pageNumber: number;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Sort order direction',
    example: 'DESC',
    enum: SortDirection,
    enumName: 'SortDirection',
    default: SortDirection.Desc,
  })
  sortDirection: SortDirection;
}
