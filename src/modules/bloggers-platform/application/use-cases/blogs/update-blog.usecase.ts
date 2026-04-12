import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUpdateBlogDto } from '../../dto/blogs/update-blog.dto';
import { BlogsRepository } from 'src/modules/bloggers-platform/repository/blogs/blogs.repository';

export class UpdateBlogCommand {
  constructor(public dto: IUpdateBlogDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute({ dto }: UpdateBlogCommand): Promise<boolean> {
    const { blogId, ...restDto } = dto;

    const blog = await this.blogRepository.getByIdOrFail(blogId);

    const updatedBlog = blog.update(restDto);

    await this.blogRepository.save(updatedBlog);

    return true;
  }
}
