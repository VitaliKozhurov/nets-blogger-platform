import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsRepository } from '@modules/bloggers-platform/posts/repository';
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
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<string> {
    const { name } = await this.blogsRepository.getByIdOrFail(dto.blogId);

    const createdPost = await this.postsFactory.createPost({
      ...dto,
      blogName: name,
    });

    await this.postsRepository.save(createdPost);

    return createdPost._id.toString();
  }
}
