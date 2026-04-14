import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/comments/comment.schema';
import { type CommentModelType } from '../../domain/comments/comment.types';
import { LikesRepository } from '../likes/likes.repository';

import { PaginationResponseMapperDto } from 'src/core/dto';
import { getPaginationParams } from 'src/core/utils';
import { LikeStatus } from '../../domain/likes/like.dto';
import { CommentResponseMapperDto } from '../../api/dto/comments/comment.mapper';
import { IGetCommentsByPostIdQueryDto } from '../../api/dto/comments/get-comments-by-post-id-query.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @Inject() private likesRepository: LikesRepository
  ) {}

  async getAllByPostId(args: {
    postId: string;
    userId?: string;
    query: IGetCommentsByPostIdQueryDto;
  }): Promise<PaginationResponseMapperDto<CommentResponseMapperDto[]>> {
    const { postId, userId, query } = args;
    const { sort, skip, limit } = getPaginationParams(query);

    const commentsPromise = this.CommentModel.find({ postId, deletedAt: null })
      .sort(sort)
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
      throw new NotFoundException('Comment not found');
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
