import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteUserByAdminCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserByAdminCommand)
export class DeleteUserByAdminUseCase implements ICommandHandler<DeleteUserByAdminCommand> {
  constructor(private userRepository: UsersRepository) {}

  async execute({ id }: DeleteUserByAdminCommand): Promise<boolean> {
    const isDeleted = await this.userRepository.softDelete(id);

    if (!isDeleted) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'User not found',
      });
    }

    return isDeleted;
  }
}
