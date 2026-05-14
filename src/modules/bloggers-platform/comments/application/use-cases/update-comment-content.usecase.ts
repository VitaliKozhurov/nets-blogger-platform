import { IUpdateCommentContentDto } from '@modules/bloggers-platform/comments/application/dto';
import { CommentsRepository } from '@modules/bloggers-platform/comments/repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class UpdateCommentContentCommand {
  constructor(public dto: IUpdateCommentContentDto) {}
}

@CommandHandler(UpdateCommentContentCommand)
export class UpdateCommentContentUseCase implements ICommandHandler<UpdateCommentContentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ dto }: UpdateCommentContentCommand): Promise<boolean> {
    const { id, content, userId } = dto;

    const isUpdated = await this.commentsRepository.update({
      commentId: id,
      content,
      userId,
    });

    if (!isUpdated) {
      const comment = await this.commentsRepository.getById(id);

      if (!comment) {
        throw new DomainException({
          code: DomainExceptionCode.NOT_FOUND_ERROR,
          message: 'Comment not found',
        });
      }

      throw new DomainException({
        code: DomainExceptionCode.FORBIDDEN_ERROR,
        message: 'Forbidden',
      });
    }

    return true;
  }
}
