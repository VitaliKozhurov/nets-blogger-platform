import { ApiProperty } from '@nestjs/swagger';
import { ICommentResponseDto } from '../../../application/dto/comments/comment-response.dto';
import { LikeStatus } from '../../../domain/likes/like.dto';

class CommentatorInfo {
  @ApiProperty({
    type: String,
    description: 'Comment owner ID',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Comment owner login',
    example: 'admin',
  })
  userLogin: string;
}

class LikesInfo {
  @ApiProperty({
    type: Number,
    description: 'Counts of likes',
    example: 100,
  })
  likesCount: string;

  @ApiProperty({
    type: Number,
    description: 'Counts of dislike',
    example: 2,
  })
  dislikesCount: string;

  @ApiProperty({
    enum: LikeStatus,
    description: 'My like status',
    example: LikeStatus.Like,
  })
  myStatus: LikeStatus;
}

export class CommentResponseDto {
  @ApiProperty({
    type: String,
    description: 'Unique comment identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Comment content',
    example: 'long comment ...',
  })
  content: string;

  @ApiProperty({
    type: CommentatorInfo,
    description: 'Commentator info',
  })
  commentatorInfo: ICommentResponseDto['commentatorInfo'];

  @ApiProperty({
    type: String,
    description: 'Blog creation timestamp',
    example: '2026-03-31T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    type: LikesInfo,
    description: 'Information about likes for current comment',
  })
  likesInfo: ICommentResponseDto['likesInfo'];
}
