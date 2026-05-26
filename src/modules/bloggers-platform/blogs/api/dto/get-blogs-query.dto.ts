import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsOptionStringParam } from 'src/core/decorators';
import { BaseQueryParamsDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import { BlogsSortBy } from '../../api/dto/blogs-sort-by.dto';

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
