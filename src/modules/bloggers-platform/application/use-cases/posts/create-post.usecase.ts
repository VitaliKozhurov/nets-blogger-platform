import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsRepository } from '../../../repository/posts/posts.repository';
import { ICreatePostDto } from '../../dto/posts/create-post.dto';
import { PostsFactory } from '../../factories/posts.factory';
import { BlogsRepository } from '../../../repository/blogs/blogs.repository';

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
