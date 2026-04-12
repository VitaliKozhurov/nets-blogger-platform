import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from 'src/modules/bloggers-platform/repository/blogs/blogs.repository';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<boolean> {
    const blog = await this.blogRepository.getByIdOrFail(id);

    blog.softDelete();

    await this.blogRepository.save(blog);

    return true;
  }
}
