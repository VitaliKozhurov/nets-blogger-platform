import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repository/users.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteUserByAdminCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserByAdminCommand)
export class DeleteUserByAdminUseCase implements ICommandHandler<DeleteUserByAdminCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserByAdminCommand): Promise<boolean> {
    const isDeleted = await this.usersRepository.softDelete(id);

    if (!isDeleted) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'User not found',
      });
    }

    return isDeleted;
  }
}
