import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICreateBlogDto } from '../dto';
import { BlogsRepository } from '../../repository/blogs.repository';
import { BlogsFactory } from '../factories';

export class CreateBlogCommand {
  constructor(public dto: ICreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsFactory: BlogsFactory,
    private blogRepository: BlogsRepository
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<string> {
    const createdBlog = await this.blogsFactory.createBlog(dto);

    await this.blogRepository.save(createdBlog);

    return createdBlog._id.toString();
  }
}
