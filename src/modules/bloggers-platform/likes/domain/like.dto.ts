export interface CreateLikeDto {
  authorId: string;
  login: string;
  parentId: string;
  likeStatus: LikeStatus;
}

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
