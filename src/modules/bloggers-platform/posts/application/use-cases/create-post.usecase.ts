import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ICreatePostDto } from '@modules/bloggers-platform/posts/application/dto';
import { PostsFactory } from '@modules/bloggers-platform/posts/application/factories';
import { BlogsQueryRepository } from 'src/modules/bloggers-platform/blogs/repository/blogs-query.repository';

export class CreatePostCommand {
  constructor(public dto: ICreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postsFactory: PostsFactory,
    private blogsQueryRepository: BlogsQueryRepository
  ) {}

  async execute({ dto }: CreatePostCommand) {
    await this.blogsQueryRepository.findByIdOrThrow(dto.blogId);

    const createdPost = await this.postsFactory.createPost(dto);

    return createdPost;
  }
}
