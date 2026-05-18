export interface ICreateCommentByPostDto {
  postId: string;
  userId: string;
  login: string;
  content: string;
}
