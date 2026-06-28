import { PostsRepository } from '@modules/bloggers-platform/posts/repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IDeletePostDto } from '../dto';

export class DeletePostCommand {
  constructor(public dto: IDeletePostDto) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ dto }: DeletePostCommand): Promise<boolean> {
    const isDeleted = await this.postsRepository.softDelete(dto);

    if (!isDeleted) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    return true;
  }
}
