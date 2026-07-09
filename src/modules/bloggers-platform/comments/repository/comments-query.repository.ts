import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { Repository } from 'typeorm';
import { CommentLikeEntity } from '../../likes/domain/comment-like.entity';
import { LikeStatus } from '../../likes/domain/dto';
import { CommentEntity } from '../domain/comment.entity';
import { ICommentsWithDetailsDto } from './dto/comment-with-details.dto';
import { IGetCommentsByPostParamsDto } from './dto/get-comments-by-post.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectRepository(CommentEntity) private commentsRepo: Repository<CommentEntity>) {}

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

    const comment = await this.commentsRepo
      .createQueryBuilder('c')
      .select([
        'c.id as "id',
        'c.content as ""content"',
        'c.createdAt as "createdAt"',
        'c.authorId as "userId"',
        'likesCount."likesCount"',
        'dislikesCount."dislikesCount"',
        'author.login as "userLogin"',
      ])
      .addSelect(
        sq =>
          sq
            .select("COALESCE(cl.status, 'None')")
            .from(CommentLikeEntity, 'cl')
            .where('cl."commentId" = c."id"')
            .andWhere('cl."userId" = :userId', { userId })
            .limit(1),
        'myStatus'
      )
      .where('c.deletedAt IS NULL AND c.id = :id', { id: commentId })
      .leftJoin('c.author', 'author')
      .leftJoin(
        subQuery => {
          return subQuery
            .select('cl."commentId"')
            .addSelect('COUNT(*)', 'likesCount')
            .from(CommentLikeEntity, 'cl')
            .where('cl.status = :likeStatus', { likeStatus: LikeStatus.Like })
            .groupBy('cl."commentId"');
        },
        'likesCount',
        'likesCount."commentId" = c.id'
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('cl.commentId')
            .addSelect('COUNT(*)', 'dislikesCount')
            .from(CommentLikeEntity, 'cl')
            .where('cl.status = :likeStatus', { likeStatus: LikeStatus.Dislike })
            .groupBy('cl."postId"');
        },
        'dislikesCount',
        'dislikesCount."commentId" = c.id'
      )
      .getRawOne();

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
