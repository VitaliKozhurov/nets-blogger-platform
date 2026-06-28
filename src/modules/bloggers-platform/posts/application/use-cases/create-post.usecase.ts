import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ICreatePostDto } from '@modules/bloggers-platform/posts/application/dto';
import { PostsFactory } from '@modules/bloggers-platform/posts/application/factories';
import { BlogsRepository } from '@modules/bloggers-platform/blogs/repository';

export class CreatePostCommand {
  constructor(public dto: ICreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postsFactory: PostsFactory,
    private blogsRepository: BlogsRepository
  ) {}

  async execute({ dto }: CreatePostCommand) {
    const blog = await this.blogsRepository.findByIdOrThrow(dto.blogId);

    return this.postsFactory.createPost({ ...dto, blogName: blog.name });
  }
}
