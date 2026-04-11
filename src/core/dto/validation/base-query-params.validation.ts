import { IsEnum } from 'class-validator';
import { QueryIsNumber } from '../../decorators/utils/query-is-number';
import { IBaseQueryParamsDto } from '../contracts/base-query-params.dto';
import { SortDirection } from '../contracts/sort-direction';

export class BaseQueryParamsValidationDto implements IBaseQueryParamsDto {
  @QueryIsNumber()
  pageNumber: number = 1;

  @QueryIsNumber()
  pageSize: number = 10;

  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;
}
