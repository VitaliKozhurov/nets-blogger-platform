import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../domain/likes/like.dto';

export class UpdateCommentLikeStatusRequestDto {
  @ApiProperty({
    enum: LikeStatus,
    description: 'Like status',
    example: LikeStatus.Like,
  })
  @IsEnum(LikeStatus)
  likeStatus: string;
}
