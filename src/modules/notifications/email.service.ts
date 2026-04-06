import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationCode(dto: { email: string; code: string }) {
    return this.mailerService.sendMail({
      to: dto.email,
      subject: 'Подтверждение регистрации',
      html: `<div>
                  <h1>Please confirm your email</h1>
                  <p>You should follow the link:   <a href='https://somesite.com/confirm-email?code=${dto.code}'>complete registration</a></p>
            </div>`,
    });
  }
}
