import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ICreateUserDto } from '../dto/create-user.dto';

import type { IUserViewDto } from '../dto';
import { UsersFactory } from '../factories/users.factory';
import { UsersService } from '../services/users.service';

export class CreateUserCommand extends Command<IUserViewDto> {
  constructor(public dto: ICreateUserDto) {
    super();
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersService: UsersService,
    private usersFactory: UsersFactory
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<IUserViewDto> {
    await this.usersService.ensureEmailIsAvailable(dto.email);

    return this.usersFactory.createConfirmedUser(dto);
  }
}
