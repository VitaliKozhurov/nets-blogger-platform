import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ICreatePostDto } from '@modules/bloggers-platform/posts/application/dto';
import { PostsFactory } from '@modules/bloggers-platform/posts/application/factories';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class CreatePostCommand {
  constructor(public dto: ICreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(private postsFactory: PostsFactory) {}

  async execute({ dto }: CreatePostCommand) {
    const createdPost = await this.postsFactory.createPost(dto);

    if (!createdPost) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Blog not found',
      });
    }

    return createdPost;
  }
}
