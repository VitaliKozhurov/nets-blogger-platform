import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repository';

export class DeleteUserByAdminCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserByAdminCommand)
export class DeleteUserByAdminUseCase implements ICommandHandler<DeleteUserByAdminCommand> {
  constructor(private userRepository: UsersRepository) {}

  async execute({ id }: DeleteUserByAdminCommand): Promise<boolean> {
    const user = await this.userRepository.findByIdOrThrow(id);

    user.softDelete();

    await this.userRepository.save(user);

    return true;
  }
}
