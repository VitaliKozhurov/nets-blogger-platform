import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersFactory } from '../../../users/application/factories';
import { UsersService } from '../../../users/application/services';
import { IRegistrationDto } from '../dto';
import { UserRegistrationEvent } from '../events';

export class RegistrationCommand {
  constructor(public dto: IRegistrationDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private eventBus: EventBus,
    private usersService: UsersService,
    private usersFactory: UsersFactory
  ) {}

  async execute({ dto }: RegistrationCommand): Promise<boolean> {
    const { login, email } = dto;

    await this.usersService.ensureUserIsAvailable({ login, email });

    const { createdUser, confirmationCode } = await this.usersFactory.createUnconfirmedUser(dto);

    this.eventBus.publish(
      new UserRegistrationEvent({ email: createdUser.email, confirmationCode })
    );

    return true;
  }
}
