import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';
import { UserPasswordRecoveryEvent } from '@modules/users-account/auth/application/events';

@EventsHandler(UserPasswordRecoveryEvent)
export class SendUserPasswordRecoveryCodeToEmailEventHandler implements IEventHandler<UserPasswordRecoveryEvent> {
  constructor(private emailService: EmailService) {}

  async handle({ eventData }: UserPasswordRecoveryEvent) {
    const { email, recoveryCode } = eventData;

    return this.emailService.sendPasswordRecoveryCode({ email, recoveryCode });
  }
}
