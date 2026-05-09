import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailerConfig } from './config/mailer.config';
import { EmailService } from './email.service';
import { SendRegistrationConfirmationCodeToEmailEventHandler } from './event-handlers/send-registration-confirmation-code-to-email.event-handler';
import { SendUserPasswordRecoveryCodeToEmailEventHandler } from './event-handlers/send-user-password-recovery-code-to-email.event-handler';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfig,
    }),
  ],
  providers: [
    EmailService,
    SendRegistrationConfirmationCodeToEmailEventHandler,
    SendUserPasswordRecoveryCodeToEmailEventHandler,
  ],
})
export class NotificationsModule {}
