import { LikeStatus } from '../../../domain/likes/like.dto';

export interface ICreateLikeDto {
  authorId: string;
  login: string;
  parentId: string;
  likeStatus: LikeStatus;
}
