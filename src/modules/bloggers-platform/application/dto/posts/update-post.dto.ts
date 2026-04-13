import { ICreatePostDto } from './create-post.dto';

export interface IUpdatePostDto extends ICreatePostDto {
  postId: string;
}
