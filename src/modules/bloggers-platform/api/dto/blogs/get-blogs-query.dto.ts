import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsOptionStringParam } from 'src/core/decorators';
import { BaseQueryParamsDto, IBaseQueryParamsDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import { BlogsSortBy } from './blogs-sort-by.dto';

export class GetBlogsQueryDto extends BaseQueryParamsDto {
  @ApiPropertyOptional({
    description: 'Filter blogs by name',
    example: 'tech',
    type: String,
    nullable: true,
  })
  @IsOptionStringParam()
  searchNameTerm: Nullable<string> = null;

  @ApiProperty({
    description: 'Field to sort blogs by',
    example: 'createdAt',
    enum: BlogsSortBy,
    enumName: 'BlogsSortBy',
  })
  @IsEnum(BlogsSortBy)
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
}

export interface IGetBlogsQueryParamsDto extends IBaseQueryParamsDto {
  searchNameTerm: Nullable<string>;
  sortBy: BlogsSortBy;
}
