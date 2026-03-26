import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationResponseDto } from 'src/core/dto';
import { Comment } from '../../domain/comments/comment.schema';
import { type CommentModelType } from '../../domain/comments/comment.types';
import { CommentResponseDto } from '../../dto/comments/comment-response.dto';
import { LikeStatus } from '../../types/likes/like-status.types';
import { LikesRepository } from '../likes/likes.repository';
import { GetCommentsByPostIdQueryParamsDto } from '../../dto/comments/get-comments-by-post-id-query-params.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @Inject() private likesRepository: LikesRepository
  ) {}

  async getAllByPostId(args: {
    postId: string;
    userId?: string;
    query: GetCommentsByPostIdQueryParamsDto;
  }): Promise<PaginationResponseDto<CommentResponseDto[]>> {
    const { postId, userId, query } = args;

    const commentsPromise = this.CommentModel.find({ postId, deletedAt: null })
      .sort(query.getSortOptions())
      .skip(query.calculateSkip())
      .limit(query.pageSize)
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

      return CommentResponseDto.mapToView(comment, myStatus);
    });

    return PaginationResponseDto.mapToViewModel({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findByIdOrThrow(args: { commentId: string; userId?: string }): Promise<CommentResponseDto> {
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

    return CommentResponseDto.mapToView(comment, myStatus);
  }
}
