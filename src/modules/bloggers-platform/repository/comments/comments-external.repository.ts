import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type CommentModelType } from '../../domain/comments/comment.types';

@Injectable()
export class CommentsExternalRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType
  ) {}

  async delete() {
    await this.CommentModel.deleteMany();
  }
}
