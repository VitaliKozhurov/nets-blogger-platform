import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
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

    const prevConfirmationData = await this.usersRepository.findRegistrationConfirmationByUserId(
      user.id
    );

    if (!prevConfirmationData) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Cannot resend confirmation email',
        extensions: [{ field: 'email', message: 'Should register first' }],
      });
    }

    if (prevConfirmationData.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Cannot resend confirmation email',
        extensions: [{ field: 'email', message: 'User is already confirmed' }],
      });
    }

    const confirmationCode = randomUUID();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersRepository.updateRegistrationConfirmation({
      userId: user.id,
      confirmationCode,
      expirationDate,
    });

    this.eventBus.publish(
      new UserRegistrationEvent({
        email: user.email,
        confirmationCode,
      })
    );

    return true;
  }
}
