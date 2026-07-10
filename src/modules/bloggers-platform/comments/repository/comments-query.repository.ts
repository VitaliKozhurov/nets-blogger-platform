import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortDirection } from 'src/core/dto';
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

    const commentsPromise = this.commentsRepo
      .createQueryBuilder('c')
      .select([
        'c.id as "id"',
        'c.content as "content"',
        'c.createdAt as "createdAt"',
        'c.authorId as "userId"',
        'author.login as "userLogin"',
        'CAST(COALESCE(like_count.count, 0) AS INTEGER) as "likesCount"', // ✅ CAST
        'CAST(COALESCE(dislike_count.count, 0) AS INTEGER) as "dislikesCount"', // ✅ CAST
      ])
      .addSelect(`COALESCE(my_like.status, 'None')`, 'myStatus')
      .where('c.deletedAt IS NULL AND c.postId = :postId', { postId: postId })
      .leftJoin('c.author', 'author')
      .leftJoin(
        CommentLikeEntity,
        'my_like',
        'my_like."commentId" = c."id" AND my_like."userId" = :userId',
        { userId: userId ?? null }
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('cl."commentId"')
            .addSelect('COUNT(*)', 'count')
            .from(CommentLikeEntity, 'cl')
            .where('cl.status = :likeStatus', { likeStatus: LikeStatus.Like })
            .groupBy('cl."commentId"');
        },
        'like_count',
        'like_count."commentId" = c.id'
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('cl."commentId"')
            .addSelect('COUNT(*)', 'count')
            .from(CommentLikeEntity, 'cl')
            .where('cl.status = :dislikeStatus', { dislikeStatus: LikeStatus.Dislike })
            .groupBy('cl."commentId"');
        },
        'dislike_count',
        'dislike_count."commentId" = c.id'
      )
      .orderBy(`c.${sortBy}`, sortDirection === SortDirection.Asc ? 'ASC' : 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();

    const totalCountPromise = this.commentsRepo
      .createQueryBuilder('c')
      .where('c.deletedAt IS NULL AND c.postId = :postId', { postId: postId })
      .getCount();

    const [comments, totalCount] = await Promise.all([commentsPromise, totalCountPromise]);

    console.log('OFFSET: ', offset);
    console.log('LIMIT: ', limit);
    console.log('comments: ', comments);

    return { comments, totalCount };
  }

  async findById(args: {
    commentId: string;
    userId?: string;
  }): Promise<ICommentsWithDetailsDto | null> {
    const { userId, commentId } = args;

    const comment = await this.commentsRepo
      .createQueryBuilder('c')
      .select([
        'c.id as "id"',
        'c.content as "content"',
        'c.createdAt as "createdAt"',
        'c.authorId as "userId"',
        'author.login as "userLogin"',
        'CAST(COALESCE(like_count.count, 0) AS INTEGER) as "likesCount"', // ✅ CAST
        'CAST(COALESCE(dislike_count.count, 0) AS INTEGER) as "dislikesCount"', // ✅ CAST
      ])
      .addSelect(`COALESCE(my_like.status, 'None')`, 'myStatus')
      .where('c.deletedAt IS NULL AND c.id = :id', { id: commentId })
      .leftJoin('c.author', 'author')
      .leftJoin(
        CommentLikeEntity,
        'my_like',
        'my_like."commentId" = c."id" AND my_like."userId" = :userId',
        { userId: userId ?? null }
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('cl."commentId"')
            .addSelect('COUNT(*)', 'count')
            .from(CommentLikeEntity, 'cl')
            .where('cl.status = :likeStatus', { likeStatus: LikeStatus.Like })
            .groupBy('cl."commentId"');
        },
        'like_count',
        'like_count."commentId" = c.id'
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('cl."commentId"')
            .addSelect('COUNT(*)', 'count')
            .from(CommentLikeEntity, 'cl')
            .where('cl.status = :dislikeStatus', { dislikeStatus: LikeStatus.Dislike })
            .groupBy('cl."commentId"');
        },
        'dislike_count',
        'dislike_count."commentId" = c.id'
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
