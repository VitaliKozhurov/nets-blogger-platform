import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';

import { CommentEntity } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(CommentEntity) private commentsRepo: Repository<CommentEntity>
  ) {}

  async save(comment: CommentEntity) {
    return this.commentsRepo.save(comment);
  }

  async getById(commentId: string) {
    return this.commentsRepo.findOneBy({ id: commentId });
  }

  async update(args: { userId: string; commentId: string; content: string }) {
    const { userId, commentId, content } = args;

    const { affected } = await this.commentsRepo.update(
      { authorId: userId, id: commentId, deletedAt: IsNull() },
      { content }
    );

    return affected === 1;
  }

  async softDelete(args: { userId: string; commentId: string }) {
    const { userId, commentId } = args;
    const { affected } = await this.commentsRepo.update(
      { authorId: userId, id: commentId, deletedAt: IsNull() },
      { deletedAt: new Date() }
    );

    return affected === 1;
  }
}
