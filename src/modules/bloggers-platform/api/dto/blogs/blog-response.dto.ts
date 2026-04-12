import { ApiProperty } from '@nestjs/swagger';

export class BlogResponseDto {
  @ApiProperty({
    type: String,
    description: 'Unique blog identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Blog name',
    example: 'Tech Insights',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Blog description',
    example: 'Latest technology news and trends',
  })
  description: string;

  @ApiProperty({
    type: String,
    description: 'Blog website URL',
    example: 'https://techinsights.com',
  })
  websiteUrl: string;

  @ApiProperty({
    type: String,
    description: 'Blog creation timestamp',
    example: '2026-03-31T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether blog has membership features enabled',
    example: false,
  })
  isMembership: boolean;
}
