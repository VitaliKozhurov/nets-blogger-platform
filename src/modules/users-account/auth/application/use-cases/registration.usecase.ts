import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersFactory } from '../../../users/application/factories/users.factory';
import type { IRegistrationDto } from '../dto/registration.dto';
import { UserRegistrationEvent } from '../events/user-registration.event';

export class RegistrationCommand {
  constructor(public dto: IRegistrationDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private eventBus: EventBus,
    private usersFactory: UsersFactory
  ) {}

  async execute({ dto }: RegistrationCommand): Promise<boolean> {
    const payload = await this.usersFactory.createUnverifiedUser(dto);

    this.eventBus.publish(new UserRegistrationEvent(payload));

    return true;
  }
}
