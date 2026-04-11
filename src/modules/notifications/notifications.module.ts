import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailConfig } from 'src/config/mail.config';
import { EmailService } from './email.service';
import { SendRegistrationConfirmationCodeToEmailEventHandler } from './event-handlers/send-registration-confirmation-code-to-email.event-handler';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
  ],
  providers: [EmailService, SendRegistrationConfirmationCodeToEmailEventHandler],
})
export class NotificationsModule {}
