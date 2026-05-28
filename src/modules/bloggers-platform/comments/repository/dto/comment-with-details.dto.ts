import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';
import { ICommentEntityDto } from '../../domain/dto';

export interface ICommentsWithDetailsDto extends Omit<
  ICommentEntityDto,
  'ownerId' | 'postId' | 'deletedAt'
> {
  userId: string;
  userLogin: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
