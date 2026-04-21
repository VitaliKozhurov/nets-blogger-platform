import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type PostModelType } from '@modules/bloggers-platform/posts/domain';
import { ICreatePostDto } from '@modules/bloggers-platform/posts/application/dto';
import { Post } from '@modules/bloggers-platform/posts/domain';

@Injectable()
export class PostsFactory {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType
  ) {}

  async createPost(dto: ICreatePostDto & { blogName: string }) {
    const newPost = await this.PostModel.createInstance(dto);

    return newPost;
  }
}
