import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICreateUserByAdminDto } from '../dto';

import { UsersFactory } from '../factories';
import { UsersService } from '../services';
import { IUserViewDto } from '../../api/dto/user-view.dto';

export class CreateUserByAdminCommand extends Command<IUserViewDto> {
  constructor(public dto: ICreateUserByAdminDto) {
    super();
  }
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase implements ICommandHandler<CreateUserByAdminCommand> {
  constructor(
    private userService: UsersService,
    private usersFactory: UsersFactory
  ) {}

  async execute({ dto }: CreateUserByAdminCommand): Promise<IUserViewDto> {
    await this.userService.ensureEmailIsAvailable(dto.email);

    return this.usersFactory.createUserByAdmin(dto);
  }
}
