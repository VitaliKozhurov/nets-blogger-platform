import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource } from 'typeorm';
import { ICommentsWithDetailsDto } from './dto/comment-with-details.dto';
import { IGetCommentsByPostParamsDto } from './dto/get-comments-by-post.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAllByPostId(
    args: IGetCommentsByPostParamsDto
  ): Promise<{ comments: ICommentsWithDetailsDto[]; totalCount: number }> {
    const { postId, userId, query } = args;
    const { sortBy, sortDirection, limit, offset } = query;

    const commentsPromise: Promise<ICommentsWithDetailsDto[]> = this.dataSource.query(
      `
          SELECT 
            c."id", 
            c."content",
            c."createdAt",
            u."id" as "userId",
            u."login" as "userLogin",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Like')::int as "likesCount",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Dislike')::int as "dislikesCount",
              COALESCE((SELECT status FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."userId" = $1 LIMIT 1), 'None') as "myStatus"
              FROM comments c
              LEFT JOIN users u ON c."ownerId" = u."id"
              WHERE c."deletedAt" IS NULL AND c."postId" = $2 
              ORDER BY ${`"${sortBy}"`} ${sortDirection}
              LIMIT $3
              OFFSET $4
        `,
      [userId ?? null, postId, limit, offset]
    );

    const totalCountPromise: Promise<[{ count: string }]> = this.dataSource.query(
      `
          SELECT COUNT(*)
            FROM comments c
            WHERE c."deletedAt" IS NULL AND c."postId" = $1 
          `,
      [postId]
    );

    const [comments, countResult] = await Promise.all([commentsPromise, totalCountPromise]);

    return {
      comments,
      totalCount: Number(countResult[0].count),
    };
  }

  async findById(args: {
    commentId: string;
    userId?: string;
  }): Promise<ICommentsWithDetailsDto | null> {
    const { userId, commentId } = args;

    const [comment]: ICommentsWithDetailsDto[] = await this.dataSource.query(
      `
          SELECT 
            c."id", 
            c."content",
            c."createdAt",
            u."id" as "userId",
            u."login" as "userLogin",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Like')::int as "likesCount",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Dislike')::int as "dislikesCount",
              COALESCE((SELECT status FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."userId" = $1 LIMIT 1), 'None') as "myStatus"
              FROM comments c
              LEFT JOIN users u ON c."ownerId" = u."id"
              WHERE c."deletedAt" IS NULL AND c."id" = $2 
        `,
      [userId ?? null, commentId]
    );

    return comment ? comment : null;
  }

  async findByIdOrThrow(args: {
    commentId: string;
    userId?: string;
  }): Promise<ICommentsWithDetailsDto> {
    const { commentId, userId } = args;

    const comment = await this.findById({ commentId, userId });

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Comment not found',
      });
    }

    return comment;
  }
}
