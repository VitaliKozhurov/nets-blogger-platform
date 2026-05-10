import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUpdateBlogDto } from '../dto';
import { BlogsRepository } from '../../repository/blogs.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class UpdateBlogCommand extends Command<boolean> {
  constructor(public dto: IUpdateBlogDto) {
    super();
  }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute({ dto }: UpdateBlogCommand): Promise<boolean> {
    const updatedBlog = await this.blogRepository.update(dto);

    if (!updatedBlog) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Blog not found',
      });
    }

    return true;
  }
}
