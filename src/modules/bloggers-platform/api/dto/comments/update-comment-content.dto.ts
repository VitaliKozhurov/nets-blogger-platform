import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from 'src/core/decorators';

export class UpdateCommentContentRequestDto {
  @ApiProperty({
    type: String,
    description: 'Comment content',
    example: 'It is good post',
    minLength: 20,
    maxLength: 300,
  })
  @IsStringWithTrim(20, 300)
  content: string;
}
