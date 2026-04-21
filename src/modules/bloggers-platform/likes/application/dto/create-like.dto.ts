import { LikeStatus } from '../../domain';

export interface ICreateLikeDto {
  authorId: string;
  login: string;
  parentId: string;
  likeStatus: LikeStatus;
}
