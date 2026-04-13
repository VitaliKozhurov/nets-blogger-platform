import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators';

export class CreatePostRequestDto {
  @ApiProperty({
    type: String,
    description: 'Post title',
    example: 'About AI',
    minLength: 1,
    maxLength: 30,
  })
  @IsStringWithTrim(1, 30)
  title: string;

  @ApiProperty({
    type: String,
    description: 'Post short description',
    example: 'Description example ...',
    minLength: 1,
    maxLength: 100,
  })
  @IsStringWithTrim(1, 100)
  shortDescription: string;

  @ApiProperty({
    type: String,
    description: 'Post main content',
    example: 'Content example ...',
    minLength: 1,
    maxLength: 1000,
  })
  @IsStringWithTrim(1, 1000)
  content: string;

  @ApiProperty({
    type: String,
    description: 'Unique blog identifier',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  blogId: string;
}
