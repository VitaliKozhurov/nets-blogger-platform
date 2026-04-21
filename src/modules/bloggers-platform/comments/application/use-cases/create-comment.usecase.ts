import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '@modules/bloggers-platform/comments/repository';
import { ICreateCommentDto } from '@modules/bloggers-platform/comments/application/dto';
import { CommentsFactory } from '@modules/bloggers-platform/comments/application/factories';
import { PostsRepository } from '@modules/bloggers-platform/posts/repository';
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
