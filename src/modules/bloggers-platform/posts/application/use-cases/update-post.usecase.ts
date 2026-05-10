import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsRepository } from '@modules/bloggers-platform/posts/repository';
import { IUpdatePostDto } from '@modules/bloggers-platform/posts/application/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class UpdatePostCommand {
  constructor(public dto: IUpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ dto }: UpdatePostCommand): Promise<boolean> {
    const isUpdated = await this.postsRepository.update(dto);

    if (!isUpdated) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    return true;
  }
}
