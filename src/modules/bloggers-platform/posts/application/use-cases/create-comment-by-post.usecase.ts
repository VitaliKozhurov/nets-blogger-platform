import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { CommentsFactory } from 'src/modules/bloggers-platform/comments';
import { PostsRepository } from '../../repository';
import { ICreateCommentByPostDto } from '../dto/create-comment-by-post.dto';
import { CommentViewMapper } from 'src/modules/bloggers-platform/comments/application/dto/comment.mapper';

export class CreateCommentByPostCommand extends Command<CommentViewMapper> {
  constructor(public dto: ICreateCommentByPostDto) {
    super();
  }
}

@CommandHandler(CreateCommentByPostCommand)
export class CreateCommentByPostUseCase implements ICommandHandler<CreateCommentByPostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private commentsFactory: CommentsFactory
  ) {}

  async execute({ dto }: CreateCommentByPostCommand): Promise<CommentViewMapper> {
    const post = await this.postsRepository.findById(dto.postId);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    return this.commentsFactory.createComment(dto);
  }
}
