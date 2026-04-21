import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { SendRegistrationConfirmationCodeToEmailEventHandler } from './event-handlers/send-registration-confirmation-code-to-email.event-handler';
import { getMailerConfig } from './config/mail.config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailerConfig,
    }),
  ],
  providers: [EmailService, SendRegistrationConfirmationCodeToEmailEventHandler],
})
export class NotificationsModule {}
