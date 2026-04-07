import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendRegistrationConfirmationCode(dto: { email: string; confirmationCode: string }) {
    return this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Подтверждение регистрации',
        html: `<div>
                  <h1>Please confirm your email</h1>
                  <p>You should follow the link:   <a href='https://somesite.com/confirm-email?code=${dto.confirmationCode}'>complete registration</a></p>
            </div>`,
      })
      .catch(err => console.log(err));
  }

  async sendPasswordRecoveryCode(dto: { email: string; recoveryCode: string }) {
    return this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Восстановление пароля',
        html: `<div>
                  <h1>Password recovery</h1>
                  <p>You should follow the link:   <a href='https://somesite.com/recovery-password?code=${dto.recoveryCode}'>recovery password</a></p>
            </div>`,
      })
      .catch(err => console.log(err));
  }
}
