import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICreateCommentParamsDto } from './dto/create-comment.params.dto';
import { ICommentEntityDto } from '../domain/dto';

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
      `  SELECT c.* 
            FROM comments c
            WHERE c."id" = $1 AND c."deletedAt" IS NULL 
        `,
      [commentId]
    );

    return comment;
  }

  async create(args: ICreateCommentParamsDto): Promise<ICommentEntityDto> {
    const { userId, postId, content } = args;

    const [comment]: ICommentEntityDto[] = await this.dataSource.query(
      `
          INSERT INTO "comments" ("ownerId", "postId", "content")
            VALUES ($1, $2, $3)
            RETURNING *
        `,
      [userId, postId, content]
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
