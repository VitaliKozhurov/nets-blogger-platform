import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LikeStatus } from '@modules/bloggers-platform/likes/domain/dto';

export class UpdateCommentLikeStatusRequestDto {
  @ApiProperty({
    enum: LikeStatus,
    description: 'Like status',
    example: LikeStatus.Like,
  })
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
