import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '@modules/bloggers-platform/comments/domain';
import { type CommentModelType } from '@modules/bloggers-platform/comments/domain';
import { ICreateCommentDto } from '@modules/bloggers-platform/comments/application/dto';

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
