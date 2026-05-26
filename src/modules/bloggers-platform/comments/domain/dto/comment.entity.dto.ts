export interface ICommentEntityDto {
  id: string;
  content: string;
  postId: string;
  ownerId: string;
  createdAt: Date;
  deletedAt: Date | null;
}
