import { IBaseQueryParamsDto } from 'src/core/dto';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export interface ICreateUserDto {
  login: string;
  email: string;
  password: string;
}

export interface IUserResponseDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export interface IGetUsersQueryParamsDto extends IBaseQueryParamsDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UsersSortBy;
}
