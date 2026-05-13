import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.schema';
import { type CommentModelType } from '../domain/comment.types';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { getPaginationParams } from 'src/core/utils';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { LikesRepository, LikeStatus } from '../../likes';
import { IGetCommentsByPostIdQueryDto } from '../api/dto';
import { CommentResponseMapperDto } from '../api/dto/comment.mapper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICommentRepositoryDto } from './dto/comment-repository.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @Inject() private likesRepository: LikesRepository
  ) {}

  async getAllByPostId(args: {
    postId: string;
    userId?: string;
    query: IGetCommentsByPostIdQueryDto;
  }): Promise<PaginationResponseMapperDto<CommentResponseMapperDto[]>> {
    const { postId, userId, query } = args;
    const { skip, limit } = getPaginationParams(query);

    const commentsPromise = this.CommentModel.find({ postId, deletedAt: null })
      .sort({
        [query.sortBy]: query.sortDirection,
      })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalCountPromise = this.CommentModel.countDocuments({ postId, deletedAt: null }).exec();

    const [comments, totalCount] = await Promise.all([commentsPromise, totalCountPromise]);

    const likesMap: Map<string, LikeStatus> = new Map<string, LikeStatus>();

    if (userId && comments.length > 0) {
      const commentsIds = comments.map(c => c._id.toString());

      const userLikes = await this.likesRepository.getLikesForUser({
        parentIds: commentsIds,
        authorId: userId,
      });

      userLikes.forEach(like => likesMap.set(like.parentId, like.status));
    }

    const items = comments.map(comment => {
      const myStatus = userId
        ? (likesMap.get(comment._id.toString()) ?? LikeStatus.None)
        : LikeStatus.None;

      return CommentResponseMapperDto.mapToView(comment, myStatus);
    });

    return PaginationResponseMapperDto.mapToViewModel({
      items,
      totalCount,
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
      [commentId, userId ?? '']
    );

    return comment ? CommentResponseMapperDto.mapToView(comment) : null;
  }

  async findByIdOrThrow(args: {
    commentId: string;
    userId?: string;
  }): Promise<CommentResponseMapperDto> {
    const { commentId, userId } = args;

    const comment = await this.CommentModel.findOne({
      _id: commentId,
      deletedAt: null,
    })
      .lean()
      .exec();

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Comment not found',
      });
    }

    const myStatus = userId
      ? await this.likesRepository.getMyStatus({
          parentId: commentId,
          authorId: userId,
        })
      : LikeStatus.None;

    return CommentResponseMapperDto.mapToView(comment, myStatus);
  }
}
