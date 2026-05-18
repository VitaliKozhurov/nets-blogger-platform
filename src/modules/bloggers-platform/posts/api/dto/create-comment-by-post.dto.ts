import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from 'src/core/decorators';

export class CreateCommentByPostRequestDto {
  @ApiProperty({
    type: String,
    description: 'Comment content',
    example: 'Comment content...',
    minLength: 20,
    maxLength: 300,
  })
  @IsStringWithTrim(20, 300)
  content: string;
}
