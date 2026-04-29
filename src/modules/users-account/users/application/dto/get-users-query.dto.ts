import { IBaseQueryParamsDto } from 'src/core/dto';
import { UsersSortBy } from '../../api';

export interface IGetUsersQueryDto extends IBaseQueryParamsDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UsersSortBy;
}
