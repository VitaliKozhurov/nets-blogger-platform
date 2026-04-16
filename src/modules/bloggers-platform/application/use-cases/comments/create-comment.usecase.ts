import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../repository/comments/comments.repository';
import { ICreateCommentDto } from '../../dto/comments/create-comment.dto';
import { CommentsFactory } from '../../factories/comments.factory';
import { PostsRepository } from 'src/modules/bloggers-platform/repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class CreateCommentCommand {
  constructor(public dto: ICreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private commentsFactory: CommentsFactory,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository
  ) {}

  async execute({ dto }: CreateCommentCommand): Promise<string> {
    const post = await this.postsRepository.getById(dto.id);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    const createdComment = await this.commentsFactory.createComment(dto);

    await this.commentsRepository.save(createdComment);

    return createdComment._id.toString();
  }
}
