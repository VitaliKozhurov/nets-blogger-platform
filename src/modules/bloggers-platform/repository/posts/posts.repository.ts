import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/posts/post.schema';
import { PostDocument, type PostModelType } from '../../domain/posts/post.types';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType
  ) {}

  async getById(id: string) {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    return post;
  }

  async save(postDocument: PostDocument) {
    await postDocument.save();
  }
}
