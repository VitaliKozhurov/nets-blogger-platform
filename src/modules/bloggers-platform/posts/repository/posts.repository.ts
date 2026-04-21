import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '@modules/bloggers-platform/posts/domain';
import { PostDocument, type PostModelType } from '@modules/bloggers-platform/posts/domain';

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
