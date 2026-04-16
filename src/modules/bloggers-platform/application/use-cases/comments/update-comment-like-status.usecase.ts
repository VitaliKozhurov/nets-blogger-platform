import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../repository/comments/comments.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateCommentLikeStatusDto } from '../../dto/comments/update-comment-like-status.dto';
import { LikesRepository } from '../../../repository/likes/likes.repository';
import { LikesFactory } from '../../factories/likes.factory';
import { LikeStatus } from '../../../domain/likes/like.dto';

export class UpdateCommentLikeStatusCommand {
  constructor(public dto: IUpdateCommentLikeStatusDto) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(
    private likesFactory: LikesFactory,
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository
  ) {}

  async execute({ dto }: UpdateCommentLikeStatusCommand): Promise<boolean> {
    const { id, likeStatus, userId: authorId, login } = dto;

    const comment = await this.commentsRepository.getById(id);

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Comment not found',
      });
    }

    const parentId = comment._id.toString();

    const like = await this.likesRepository.getLikeByAuthorId({
      parentId,
      authorId,
    });

    if (!like) {
      if (likeStatus === LikeStatus.None) {
        return true;
      }

      const currentLike = await this.likesFactory.createLike({
        authorId,
        login,
        parentId,
        likeStatus,
      });

      comment.applyIncomingLikeStatus(likeStatus);

      await this.likesRepository.save(currentLike);
      await this.commentsRepository.save(comment);

      return true;
    }

    comment.updateLikesInfo({
      currentLike: like,
      nextLikeStatus: likeStatus,
    });

    like.updateLikeStatus(likeStatus);

    await this.likesRepository.save(like);
    await this.commentsRepository.save(comment);

    return true;
  }
}
