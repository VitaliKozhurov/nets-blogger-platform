import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PaginationViewMapper } from 'src/core/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { getPaginationParams } from 'src/core/utils';
import { DataSource } from 'typeorm';
import { IGetCommentsByPostIdQueryDto } from '../api/dto';
import { CommentResponseMapperDto } from '../application/dto/comment.mapper';
import { ICommentRepositoryDto } from './dto/comment-repository.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAllByPostId(args: {
    postId: string;
    userId?: string;
    query: IGetCommentsByPostIdQueryDto;
  }): Promise<PaginationViewMapper<CommentResponseMapperDto[]>> {
    const { postId, userId, query } = args;
    const { offset, limit } = getPaginationParams(query);
    const { sortBy, sortDirection } = query;

    const sortColumn = `"${sortBy}"`;

    const commentsPromise: Promise<ICommentRepositoryDto[]> = this.dataSource.query(
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
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."userId" = $2 LIMIT 1), 'None') as "myStatus"
              FROM comments c
              LEFT JOIN users u ON c."ownerId" = u."id"
              WHERE c."deletedAt" IS NULL AND c."postId" = $1 
              ORDER BY ${sortColumn} ${sortDirection}
              LIMIT $3
              OFFSET $4
        `,
      [postId, userId, limit, offset]
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

    const items = comments.map(comment => {
      return CommentResponseMapperDto.mapToView(comment);
    });

    return PaginationViewMapper.mapToViewModel({
      items,
      totalCount: Number(countResult[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findById(args: {
    commentId: string;
    userId?: string;
  }): Promise<CommentResponseMapperDto | null> {
    const { commentId, userId } = args;

    const [comment]: ICommentRepositoryDto[] = await this.dataSource.query(
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
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."userId" = $2 LIMIT 1), 'None') as "myStatus"
              FROM comments c
              LEFT JOIN users u ON c."ownerId" = u."id"
              WHERE c."deletedAt" IS NULL AND c."id" = $1 
        `,
      [commentId, userId]
    );

    return comment ? CommentResponseMapperDto.mapToView(comment) : null;
  }

  async findByIdOrThrow(args: {
    commentId: string;
    userId?: string;
  }): Promise<CommentResponseMapperDto> {
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
