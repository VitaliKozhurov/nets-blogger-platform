import { ICreateCommentDto } from '@modules/bloggers-platform/comments/application/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsFactory {
  constructor() {}

  async createComment(dto: ICreateCommentDto) {
    const newComment = this.CommentModel.createInstance(dto);

    return newComment;
  }
}
