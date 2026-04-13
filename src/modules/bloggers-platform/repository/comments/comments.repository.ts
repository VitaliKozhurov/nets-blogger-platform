import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { Comment } from '../../domain/comments/comment.schema';
import { CommentDocument, type CommentModelType } from '../../domain/comments/comment.types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType
  ) {}

  async getByIdOrFail(id: string) {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Comment not found',
      });
    }

    return comment;
  }

  async save(commentDocument: CommentDocument) {
    await commentDocument.save();
  }
}
