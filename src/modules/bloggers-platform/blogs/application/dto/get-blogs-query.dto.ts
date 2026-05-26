import { IBaseQueryParamsDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import { BlogsSortBy } from '../../api/dto/blogs-sort-by.dto';

export interface IGetBlogsQueryDto extends IBaseQueryParamsDto {
  searchNameTerm: Nullable<string>;
  sortBy: BlogsSortBy;
}
