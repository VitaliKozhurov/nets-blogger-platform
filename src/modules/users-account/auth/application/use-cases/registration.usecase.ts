import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import type { IRegistrationDto } from '../dto/registration.dto';
import { UserRegistrationEvent } from '../events/user-registration.event';
import { UsersFactory } from '../../../users/application/factories/users.factory';
import { UsersService } from '../../../users/application/services/users.service';

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
    await this.usersService.ensureUserIsAvailable(dto);

    const { user, confirmationCode } = await this.usersFactory.createUnconfirmedUser(dto);

    this.eventBus.publish(
      new UserRegistrationEvent({
        email: user.email,
        confirmationCode,
      })
    );

    return true;
  }
}
