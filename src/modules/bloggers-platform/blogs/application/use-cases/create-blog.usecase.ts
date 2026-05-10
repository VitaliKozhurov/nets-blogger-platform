import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICreateBlogDto } from '../dto';
import { BlogsFactory } from '../factories';
import { IBlogViewDto } from '../../api/dto/blog-view.dto';

export class CreateBlogCommand extends Command<IBlogViewDto> {
  constructor(public dto: ICreateBlogDto) {
    super();
  }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogsFactory: BlogsFactory) {}

  async execute({ dto }: CreateBlogCommand) {
    const createdBlog = await this.blogsFactory.createBlog(dto);

    return createdBlog;
  }
}
