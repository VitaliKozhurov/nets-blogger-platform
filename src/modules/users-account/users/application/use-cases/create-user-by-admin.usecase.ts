import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICreateUserByAdminDto } from '../dto';
import { IUserViewDto } from '../../repository';
import { UsersFactory } from '../factories';
import { UsersService } from '../services';

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

    const createdUserByAdmin = await this.usersFactory.createUserByAdmin(dto);

    return createdUserByAdmin;
  }
}
