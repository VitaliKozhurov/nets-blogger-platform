import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersFactory } from '../../../users/application/factories/users.factory';
import type { IRegistrationDto } from '../dto/registration.dto';
import { UserRegistrationEvent } from '../events/user-registration.event';
import { isUniqueEntityError } from 'src/core/utils/predicates';
import { USER_UNIQUE_CONSTRAINTS } from 'src/modules/users-account/users/domain/user.constraint';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

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
    try {
      const payload = await this.usersFactory.createUnverifiedUser(dto);

      this.eventBus.publish(new UserRegistrationEvent(payload));

      return true;
    } catch (error) {
      if (isUniqueEntityError(error)) {
        const constraint = error.driverError.constraint as keyof typeof USER_UNIQUE_CONSTRAINTS;

        if (!USER_UNIQUE_CONSTRAINTS[constraint]) {
          throw error;
        }

        throw new DomainException({
          code: DomainExceptionCode.BAD_REQUEST_ERROR,
          message: 'User with provided credentials already exists',
          extensions: [USER_UNIQUE_CONSTRAINTS[constraint]],
        });
      }
      throw error;
    }
  }
}
