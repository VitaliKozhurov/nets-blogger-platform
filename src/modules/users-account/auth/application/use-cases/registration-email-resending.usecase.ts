import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { UsersRepository } from '../../../users/repository/users.repository';
import type { IRegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { UserRegistrationEvent } from '../events/user-registration.event';

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
        message: 'Cannot resend confirmation email',
        extensions: [{ field: 'email', message: 'Invalid email' }],
      });
    }

    const isConfirmed = user.checkIsConfirmed();

    if (isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Cannot resend confirmation email',
        extensions: [{ field: 'email', message: 'User is already confirmed' }],
      });
    }

    const updatedUser = user.updateConfirmationCode();
    const savedUser = await this.usersRepository.save(updatedUser);

    this.eventBus.publish(
      new UserRegistrationEvent({
        email: savedUser.email,
        confirmationCode: savedUser.confirmation.code as string,
      })
    );

    return true;
  }
}
