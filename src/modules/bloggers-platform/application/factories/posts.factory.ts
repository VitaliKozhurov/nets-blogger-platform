import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type PostModelType } from '../../domain/posts/post.types';
import { ICreatePostDto } from '../dto/posts/create-post.dto';
import { Post } from '../../domain/posts/post.schema';

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
