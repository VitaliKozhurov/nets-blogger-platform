import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../repository/comments/comments.repository';
import { ICreateCommentDto } from '../../dto/comments/create-comment.dto';
import { CommentsFactory } from '../../factories/comments.factory';

export class CreateCommentCommand {
  constructor(public dto: ICreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private commentsFactory: CommentsFactory,
    private commentsRepository: CommentsRepository
  ) {}

  async execute({ dto }: CreateCommentCommand): Promise<boolean> {
    const createdComment = await this.commentsFactory.createComment(dto);

    await this.commentsRepository.save(createdComment);

    return true;
  }
}
