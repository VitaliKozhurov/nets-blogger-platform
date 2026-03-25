import { CreatePostByBlogIdRequestDto } from './create-post-by-blog-id-request.dto';

export class CreatePostRequestDto extends CreatePostByBlogIdRequestDto {
  blogId: string;
}
