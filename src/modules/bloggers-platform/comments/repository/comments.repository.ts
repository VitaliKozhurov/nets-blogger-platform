import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.schema';
import { CommentDocument, type CommentModelType } from '../domain/comment.types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType
  ) {}

  async getById(id: string) {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    return comment;
  }

  async save(commentDocument: CommentDocument) {
    await commentDocument.save();
  }
}
