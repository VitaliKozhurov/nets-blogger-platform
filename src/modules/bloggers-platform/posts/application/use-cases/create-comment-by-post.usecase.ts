import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { CommentsFactory } from 'src/modules/bloggers-platform/comments';
import { CommentResponseMapperDto } from 'src/modules/bloggers-platform/comments/api/dto/comment.mapper';
import { PostsRepository } from '../../repository';
import { ICreateCommentByPostDto } from '../dto/create-comment-by-post.dto';

export class CreateCommentByPostCommand extends Command<CommentResponseMapperDto> {
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

  async execute({ dto }: CreateCommentByPostCommand): Promise<CommentResponseMapperDto> {
    const post = await this.postsRepository.findById(dto.postId);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    const createdComment = await this.commentsFactory.createComment(dto);

    return createdComment;
  }
}
