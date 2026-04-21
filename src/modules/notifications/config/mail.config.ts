import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../../../config/env.interface';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailerConfig = (configService: ConfigService): MailerOptions => {
  return {
    transport: {
      service: 'gmail',
      auth: {
        user: configService.getOrThrow<string>(EnvVariables.APP_EMAIL_ADDRESS),
        pass: configService.getOrThrow<string>(EnvVariables.APP_EMAIL_PASSWORD),
      },
    },
    defaults: {
      from: '"Nest Blogger platform" <blogger@example.com>',
    },
  };
};
