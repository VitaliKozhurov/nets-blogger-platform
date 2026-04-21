import { LikeStatus } from '@modules/bloggers-platform/likes/domain';
import { RequestUserDto } from 'src/modules/users-account/auth';

export interface IUpdateCommentLikeStatusDto extends RequestUserDto {
  id: string;
  likeStatus: LikeStatus;
}
