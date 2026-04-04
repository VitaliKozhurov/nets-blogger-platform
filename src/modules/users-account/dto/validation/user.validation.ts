import { IsEnum, Matches } from 'class-validator';
import { IsOptionStringParam, IsStringWithTrim } from 'src/core/decorators';
import { BaseQueryParamsValidationDto, IBaseQueryParamsDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import { EMAIL_REGEX, LOGIN_REGEX } from '../../constants/regex';
import { ICreateUserDto, UsersSortBy } from '../contracts/user.dto';

export class CreateUserRequestBodyDto implements ICreateUserDto {
  @IsStringWithTrim(3, 10)
  @Matches(LOGIN_REGEX)
  login: string;

  @IsStringWithTrim(6, 20)
  password: string;

  @Matches(EMAIL_REGEX)
  email: string;
}

export class GetUsersQueryParamsDto
  extends BaseQueryParamsValidationDto
  implements IBaseQueryParamsDto
{
  @IsOptionStringParam()
  searchLoginTerm: Nullable<string> = null;

  @IsOptionStringParam()
  searchEmailTerm: Nullable<string> = null;

  @IsEnum(UsersSortBy)
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;
}
