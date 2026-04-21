import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators';
import { WEB_SITE_URL_REGEX } from '@modules/bloggers-platform/constants';

export class CreateBlogRequestDto {
  @ApiProperty({
    type: String,
    description: 'Blog name',
    example: 'Tech Insights',
    minLength: 1,
    maxLength: 15,
  })
  @IsStringWithTrim(1, 15)
  name: string;

  @ApiProperty({
    type: String,
    description: 'Blog description',
    example: 'Latest technology news and trends from industry experts',
    minLength: 1,
    maxLength: 500,
  })
  @IsStringWithTrim(1, 500)
  description: string;

  @ApiProperty({
    type: String,
    description: 'Blog website URL',
    example: 'https://techinsights.com',
    pattern: '^https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}(/.*)?$',
  })
  @IsStringWithTrim(1, 100)
  @Matches(WEB_SITE_URL_REGEX)
  websiteUrl: string;
}
