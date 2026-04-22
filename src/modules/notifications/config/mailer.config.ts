import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { EnvVariables } from 'src/core/types/env.interface';
import { configValidationUtility } from 'src/core/utils';

@Injectable()
export class MailerConfig {
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
}
