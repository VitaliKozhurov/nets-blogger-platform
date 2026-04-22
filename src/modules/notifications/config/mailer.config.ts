import { Injectable } from '@nestjs/common';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { EnvVariables } from 'src/core/types/env.interface';
import { configValidationUtility } from 'src/core/utils';

@Injectable()
export class MailerConfig implements MailerOptionsFactory {
  constructor(private configService: ConfigService<unknown, true>) {
    this.email = this.configService.get(EnvVariables.APP_EMAIL_ADDRESS);

    this.emailPassword = this.configService.get(EnvVariables.APP_EMAIL_PASSWORD);

    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: `Should set email address for mailer module`,
  })
  email: string;

  @IsNotEmpty({
    message: `Should set email password for mailer module`,
  })
  emailPassword: string;

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        service: 'gmail',
        auth: { user: this.email, pass: this.emailPassword },
      },
      defaults: {
        from: '"Nest Blogger platform" <blogger@example.com>',
      },
    };
  }
}
