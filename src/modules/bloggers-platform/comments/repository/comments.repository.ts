import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type RawCommentType = {
  id: string;
  content: string;
  postId: string;
  ownerId: string;
  deletedAt: Date | null;
};

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getById(commentId: string) {
    const [comment]: RawCommentType[] = await this.dataSource.query(
      `  SELECT c.*, 
            FROM comments c
            WHERE c."deletedAt" IS NULL 
        `,
      [commentId]
    );

    return comment;
  }

  async update(args: { ownerId: string; commentId: string; content: string }) {
    const { ownerId, commentId, content } = args;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE "comments"
            SET "content" = $3
            WHERE  id = $1 AND "ownerId" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [commentId, ownerId, content]
    );

    return rows.length > 0;
  }
}
