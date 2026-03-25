import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/comments/comment.schema';
import { type CommentModelType } from '../../domain/comments/comment.types';
import { PaginationResponseDto } from 'src/core/dto';
import { CommentResponseDto } from '../../dto/comments/comment-response.dto';
import { LikesRepository } from '../likes/likes.repository';
import { Like } from '../../domain/likes/like.schema';
import { type LikeModelType } from '../../domain/likes/like.types';
import { LikeStatus } from '../../types/likes/like-status.types';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    @Inject() private likesRepository: LikesRepository
  ) {}

  async getAllForPost(args: {
    postId: string;
    userId?: string;
  }): Promise<PaginationResponseDto<CommentResponseDto[]>> {
    const { postId, userId } = args;

    const comments = await this.CommentModel.find({ postId }).lean().exec();

    const commentsIds = comments.map(c => c._id.toString());

    const likes = await this.LikeModel.find({ parentId: { $in: commentsIds } });

    const likesWithMyStatus = likes.reduce(
      (acc, curr) => {
        acc[curr._id.toString()] = curr.authorId === userId ? curr.status : LikeStatus.None;

        return acc;
      },
      {} as Record<string, LikeStatus>
    );

    return {} as Promise<PaginationResponseDto<CommentResponseDto[]>>;
  }

  async getByIdOrThrowNotFoundError(args: {
    commentId: string;
    userId?: string;
  }): Promise<CommentResponseDto> {
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

    const myStatus = await this.likesRepository.getMyStatus({
      parentId: commentId,
      authorId: userId,
    });

    return CommentResponseDto.mapToView(comment, myStatus);
  }
}
