import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ICreateUserByAdminDto } from '../dto/create-user-by-admin.dto';

import { UsersFactory } from '../factories/users.factory';
import { UsersService } from '../services/users.service';
import type { IUserViewDto } from '../../api/dto/user-view.dto';

export class CreateUserByAdminCommand extends Command<IUserViewDto> {
  constructor(public dto: ICreateUserByAdminDto) {
    super();
  }
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase implements ICommandHandler<CreateUserByAdminCommand> {
  constructor(
    private usersService: UsersService,
    private usersFactory: UsersFactory
  ) {}

  async execute({ dto }: CreateUserByAdminCommand): Promise<IUserViewDto> {
    await this.usersService.ensureEmailIsAvailable(dto.email);

    return this.usersFactory.createUserByAdmin(dto);
  }
}
