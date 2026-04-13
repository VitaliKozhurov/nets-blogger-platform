import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseQueryParamsDto, IBaseQueryParamsDto } from 'src/core/dto';
import { PostsSortBy } from './posts-sort-by.dto';

export class GetPostsQueryDto extends BaseQueryParamsDto {
  @ApiProperty({
    description: 'Field to sort posts by',
    example: 'createdAt',
    enum: PostsSortBy,
    enumName: 'PostsSortBy',
  })
  @IsEnum(PostsSortBy)
  sortBy: PostsSortBy = PostsSortBy.CreatedAt;
}

export interface IGetPostsQueryParamsDto extends IBaseQueryParamsDto {
  sortBy: PostsSortBy;
}
