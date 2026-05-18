import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICreateCommentByPostDto } from '../dto/create-comment-by-post.dto';
import { CommentsFactory } from 'src/modules/bloggers-platform/comments';

export class CreateCommentByPostCommand extends Command<string> {
  constructor(public dto: ICreateCommentByPostDto) {
    super();
  }
}

@CommandHandler(CreateCommentByPostCommand)
export class CreateCommentByPostUseCase implements ICommandHandler<CreateCommentByPostCommand> {
  constructor(
    private commentsFactory: CommentsFactory,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository
  ) {}

  async execute({ dto }: CreateCommentByPostCommand): Promise<string> {
    const { postId, userId, content } = dto;

    // const post = await this.postsRepository.getById(dto.id);

    // if (!post) {
    //   throw new DomainException({
    //     code: DomainExceptionCode.NOT_FOUND_ERROR,
    //     message: 'Post not found',
    //   });
    // }

    // const createdComment = await this.commentsFactory.createComment(dto);

    // await this.commentsRepository.save(createdComment);

    // return createdComment._id.toString();

    return '';
  }
}
