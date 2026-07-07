import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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
    const [comment]: any[] = await this.dataSource.query(
      `  SELECT c.* 
            FROM comments c
            WHERE c."id" = $1 AND c."deletedAt" IS NULL 
        `,
      [commentId]
    );

    return comment;
  }

  async update(args: { userId: string; commentId: string; content: string }) {
    const { userId, commentId, content } = args;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE "comments"
            SET "content" = $3
            WHERE  "ownerId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [userId, commentId, content]
    );

    return rows.length > 0;
  }

  async softDelete(args: { userId: string; commentId: string }) {
    const { userId, commentId } = args;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE "comments"
            SET "deletedAt" = NOW()
            WHERE  "ownerId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [userId, commentId]
    );

    return rows.length > 0;
  }
}
