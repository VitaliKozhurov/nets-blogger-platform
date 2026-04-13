import { ApiProperty } from '@nestjs/swagger';
import { LikeStatus } from 'src/modules/bloggers-platform/dto/contracts/like.dto';
import { IPostResponseDto } from '../../../application/dto/posts/post-response.dto';

class NewestLike {
  @ApiProperty({
    type: String,
    description: 'Post addedAt timestamp',
    example: '2026-03-31T10:30:00.000Z',
    format: 'date-time',
  })
  addedAt: string;

  @ApiProperty({
    type: String,
    description: 'Unique user identifier',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'User login',
    example: 'Admin',
  })
  title: string;
}

class ExtendedPostLikeInfo {
  @ApiProperty({
    type: Number,
    description: 'Likes count',
    example: 100,
  })
  likesCount: string;

  @ApiProperty({
    type: Number,
    description: 'Dislikes count',
    example: 15,
  })
  dislikesCount: string;

  @ApiProperty({
    enum: LikeStatus,
    description: 'Like status',
    example: LikeStatus.Like,
  })
  myStatus: LikeStatus;

  @ApiProperty({
    type: [NewestLike],
    description: 'Like status',
    example: LikeStatus.Like,
  })
  newestLikes: IPostResponseDto['extendedLikesInfo']['newestLikes'][];
}

export class PostResponseDto {
  @ApiProperty({
    type: String,
    description: 'Unique post identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Post title',
    example: 'About AI',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Post short description',
    example: 'Description example ...',
    minLength: 1,
    maxLength: 100,
  })
  shortDescription: string;

  @ApiProperty({
    type: String,
    description: 'Post main content',
    example: 'Content example ...',
  })
  content: string;

  @ApiProperty({
    type: String,
    description: 'Unique blog identifier',
    example: '507f1f77bcf86cd799439011',
  })
  blogId: string;

  @ApiProperty({
    type: String,
    description: 'Blog name',
    example: 'About Tech',
  })
  blogName: string;

  @ApiProperty({
    type: String,
    description: 'Post creation timestamp',
    example: '2026-03-31T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    type: ExtendedPostLikeInfo,
    description: 'additional information about post likes.',
  })
  extendedLikesInfo: IPostResponseDto['extendedLikesInfo'];
}
