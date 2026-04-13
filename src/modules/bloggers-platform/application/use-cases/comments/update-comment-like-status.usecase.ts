import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../repository/comments/comments.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateCommentLikeStatusDto } from '../../dto/comments/update-comment-like-status.dto';
import { LikesRepository } from '../../../repository/likes/likes.repository';
import { LikeStatus } from '../../../dto/contracts/like.dto';
import { LikesFactory } from '../../factories/likes.factory';

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

    const comment = await this.commentsRepository.getByIdOrFail(id);

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

      await this.likesRepository.
      await this.commentsRepository.save(comment)
    }

    comment.updateLikesInfo({
      currentLike,
      nextLikeStatus: likeStatus,
    });

    await this.commentsRepository.save(comment);

    return true;
  }
}
