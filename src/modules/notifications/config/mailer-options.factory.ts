import { MailerOptions } from '@nestjs-modules/mailer';
import { MailerConfig } from './mailer.config';

export const createMailerOptions = (configService: MailerConfig): MailerOptions => {
  return {
    transport: {
      service: 'gmail',
      auth: { user: configService.email, pass: configService.emailPassword },
    },
    defaults: {
      from: '"Nest Blogger platform" <blogger@example.com>',
    },
  };
};
