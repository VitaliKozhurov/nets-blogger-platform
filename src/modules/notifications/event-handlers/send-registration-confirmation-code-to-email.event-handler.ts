import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegistrationEvent } from 'src/modules/users-account/application/events/user-registration.event';
import { EmailService } from '../email.service';

@EventsHandler(UserRegistrationEvent)
export class SendRegistrationConfirmationCodeToEmailEventHandler implements IEventHandler<UserRegistrationEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserRegistrationEvent) {
    const { email, confirmationCode } = event;

    return this.emailService.sendRegistrationConfirmationCode({ email, confirmationCode });
  }
}
