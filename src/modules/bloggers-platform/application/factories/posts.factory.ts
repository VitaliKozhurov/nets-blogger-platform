import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blogs/blog.schema';
import { type PostModelType } from '../../domain/posts/post.types';
import { ICreatePostDto } from '../dto/posts/create-post.dto';

@Injectable()
export class PostsFactory {
  constructor(
    @InjectModel(Blog.name)
    private PostModel: PostModelType
  ) {}

  async createPost(dto: ICreatePostDto & { blogName: string }) {
    const newPost = await this.PostModel.createInstance(dto);

    return newPost;
  }
}
