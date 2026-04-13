import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../repository/comments/comments.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateCommentContentDto } from '../../dto/comments/update-comment-content.dto';

export class UpdateCommentContentCommand {
  constructor(public dto: IUpdateCommentContentDto) {}
}

@CommandHandler(UpdateCommentContentCommand)
export class UpdateCommentContentUseCase implements ICommandHandler<UpdateCommentContentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ dto }: UpdateCommentContentCommand): Promise<boolean> {
    const { id, content, userId } = dto;

    const comment = await this.commentsRepository.getByIdOrFail(id);

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

    comment.updateContent(content);

    await this.commentsRepository.save(comment);

    return true;
  }
}
