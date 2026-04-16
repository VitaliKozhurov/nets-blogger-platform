import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../repository/comments/comments.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IDeleteCommentDto } from '../../dto/comments/delete-comment.dto';

export class DeleteCommentCommand {
  constructor(public dto: IDeleteCommentDto) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ dto }: DeleteCommentCommand): Promise<boolean> {
    const { id, userId } = dto;

    const comment = await this.commentsRepository.getById(id);

   

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Comment not found',
      });
    }

    const isDeniedPermissions = comment.commentatorInfo.userId !== userId;

    

    if (isDeniedPermissions) {
      throw new DomainException({
        code: DomainExceptionCode.FORBIDDEN_ERROR,
        message: 'Forbidden',
      });
    }

    comment.softDelete();

    await this.commentsRepository.save(comment);

    return true;
  }
}
