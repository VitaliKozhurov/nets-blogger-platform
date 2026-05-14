import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '@modules/bloggers-platform/comments/repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IDeleteCommentDto } from '@modules/bloggers-platform/comments/application/dto';

export class DeleteCommentCommand {
  constructor(public dto: IDeleteCommentDto) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ dto }: DeleteCommentCommand): Promise<boolean> {
    const { id, userId } = dto;

    const isDeleted = await this.commentsRepository.softDelete({
      userId,
      commentId: id,
    });

    if (!isDeleted) {
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
