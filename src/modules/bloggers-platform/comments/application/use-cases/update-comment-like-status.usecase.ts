import { IUpdateCommentLikeStatusDto } from '@modules/bloggers-platform/comments/application/dto';
import { CommentsRepository } from '@modules/bloggers-platform/comments/repository';
import { LikesRepository } from '@modules/bloggers-platform/likes/repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class UpdateCommentLikeStatusCommand {
  constructor(public dto: IUpdateCommentLikeStatusDto) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository
  ) {}

  async execute({ dto }: UpdateCommentLikeStatusCommand): Promise<boolean> {
    const { id, likeStatus, userId } = dto;

    const comment = await this.commentsRepository.getById(id);

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Comment not found',
      });
    }

    const commentId = comment.id;

    await this.likesRepository.updateCommentLike({
      userId,
      commentId,
      likeStatus,
    });

    return true;
  }
}
