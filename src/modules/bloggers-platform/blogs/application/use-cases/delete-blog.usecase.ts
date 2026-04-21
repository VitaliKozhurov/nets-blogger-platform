import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repository/blogs.repository';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<boolean> {
    const blog = await this.blogsRepository.getByIdOrFail(id);

    blog.softDelete();

    await this.blogsRepository.save(blog);

    return true;
  }
}
