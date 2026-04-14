import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/comments/comment.schema';
import { type CommentModelType } from '../../domain/comments/comment.types';
import { ICreateCommentDto } from '../dto/comments/create-comment.dto';

@Injectable()
export class CommentsFactory {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType
  ) {}

  async createComment(dto: ICreateCommentDto) {
    const newComment = this.CommentModel.createInstance(dto);

    return newComment;
  }
}
