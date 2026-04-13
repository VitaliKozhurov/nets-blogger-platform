import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from 'src/modules/bloggers-platform/repository/posts/posts.repository';

export class DeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostCommand): Promise<boolean> {
    const post = await this.postsRepository.getByIdOrFail(id);

    post.softDelete();

    await this.postsRepository.save(post);

    return true;
  }
}
