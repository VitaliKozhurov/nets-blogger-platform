import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegistrationEvent } from '@modules/users-account/auth/application/events';
import { EmailService } from '../email.service';

@EventsHandler(UserRegistrationEvent)
export class SendRegistrationConfirmationCodeToEmailEventHandler implements IEventHandler<UserRegistrationEvent> {
  constructor(private emailService: EmailService) {}

  async handle({ eventData }: UserRegistrationEvent) {
    const { email, confirmationCode } = eventData;

    return this.emailService.sendRegistrationConfirmationCode({ email, confirmationCode });
  }
}
