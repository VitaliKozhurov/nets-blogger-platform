import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../likes';
import { CommentResponseMapperDto } from '../api/dto/comment.mapper';

type RawCommentType = {
  id: string;
  content: string;
  postId: string;
  ownerId: string;
  createdAt: Date;
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

  async create(args: { userId: string; login: string; postId: string; content: string }) {
    const { userId, login, postId, content } = args;

    const [comment]: RawCommentType[] = await this.dataSource.query(
      `
          INSERT INTO "comments" ("ownerId", "postId", "content")
            VALUES (value1, value2, value3)
            RETURNING *
        `,
      [userId, postId, content]
    );

    return CommentResponseMapperDto.mapToView({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
      userId: comment.ownerId,
      userLogin: login,
    });
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
