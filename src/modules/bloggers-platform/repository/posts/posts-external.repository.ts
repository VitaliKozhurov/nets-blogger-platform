import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/posts/post.schema';
import { type PostModelType } from '../../domain/posts/post.types';

@Injectable()
export class PostsExternalRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType
  ) {}

  async delete() {
    await this.PostModel.deleteMany();
  }
}
