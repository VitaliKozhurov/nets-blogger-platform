import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IRegistrationEmailResendingDto } from '../../dto/auth/registration-email-resending.dto';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { UserRegistrationEvent } from '../../events/user-registration.event';

export class RegistrationEmailResendingCommand {
  constructor(public dto: IRegistrationEmailResendingDto) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand> {
  constructor(
    private eventBus: EventBus,
    private usersRepository: UsersRepository
  ) {}

  async execute({ dto }: RegistrationEmailResendingCommand): Promise<boolean> {
    const user = await this.usersRepository.findByLoginOrEmail(dto.email);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Email is invalid',
        extensions: [{ field: 'email', message: 'Invalid email' }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User is confirmed',
        extensions: [{ field: 'email', message: 'User is confirmed' }],
      });
    }

    const updatedUser = user.updateRegistrationConfirmationCode();

    await this.usersRepository.save(updatedUser);

    this.eventBus.publish(
      new UserRegistrationEvent({
        email: updatedUser.email,
        confirmationCode: updatedUser.emailConfirmation.confirmationCode ?? '',
      })
    );

    return true;
  }
}
