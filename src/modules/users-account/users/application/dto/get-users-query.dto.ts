import { IBaseQueryParamsDto } from 'src/core/dto';
import { UsersSortBy } from '../../api/dto/users-sort-by.dto';

export interface IGetUsersQueryDto extends IBaseQueryParamsDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UsersSortBy;
}
