import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repository/blogs.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<boolean> {
    const isDeleted = await this.blogsRepository.softDelete(id);

    if (!isDeleted) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Blog not found',
      });
    }

    return true;
  }
}
