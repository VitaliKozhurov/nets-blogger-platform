import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';
import { UserPasswordRecoveryEvent } from 'src/modules/users-account/application/events/user-password-recovery.event';

@EventsHandler(UserPasswordRecoveryEvent)
export class SendUserPasswordRecoveryCodeToEmailEventHandler implements IEventHandler<UserPasswordRecoveryEvent> {
  constructor(private emailService: EmailService) {}

  async handle({ eventData }: UserPasswordRecoveryEvent) {
    const { email, recoveryCode } = eventData;

    return this.emailService.sendPasswordRecoveryCode({ email, recoveryCode });
  }
}
