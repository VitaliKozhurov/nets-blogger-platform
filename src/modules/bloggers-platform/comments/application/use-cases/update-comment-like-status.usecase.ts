import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '@modules/bloggers-platform/comments/repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateCommentLikeStatusDto } from '@modules/bloggers-platform/comments/application/dto';
import { LikesRepository } from '@modules/bloggers-platform/likes/repository';

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

    await this.likesRepository.upsertCommentLike({
      userId,
      commentId,
      likeStatus,
    });

    return true;
  }
}
