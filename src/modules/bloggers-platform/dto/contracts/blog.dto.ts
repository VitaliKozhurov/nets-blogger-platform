import { IBaseQueryParamsDto } from 'src/core/dto';
import { Nullable } from 'src/core/types';

export enum BlogsSortBy {
  Name = 'name',
  CreatedAt = 'createdAt',
}

export interface IBlogResponseDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface IGetBlogsQueryParamsDto extends IBaseQueryParamsDto {
  searchNameTerm: Nullable<string>;
  sortBy: BlogsSortBy;
}
