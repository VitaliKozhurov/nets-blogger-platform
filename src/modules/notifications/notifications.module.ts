import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { createMailerOptions } from './config/mailer-options.factory';
import { MailerConfig } from './config/mailer.config';
import { EmailService } from './email.service';
import { SendRegistrationConfirmationCodeToEmailEventHandler } from './event-handlers/send-registration-confirmation-code-to-email.event-handler';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [MailerConfig],
      useFactory: createMailerOptions,
    }),
  ],
  providers: [EmailService, MailerConfig, SendRegistrationConfirmationCodeToEmailEventHandler],
})
export class NotificationsModule {}
