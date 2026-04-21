import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '@modules/bloggers-platform/comments/repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateCommentLikeStatusDto } from '@modules/bloggers-platform/comments/application/dto';
import { LikesRepository } from '@modules/bloggers-platform/likes/repository';
import { LikesFactory } from '@modules/bloggers-platform/likes/application/factories';
import { LikeStatus } from '@modules/bloggers-platform/likes/domain';

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
