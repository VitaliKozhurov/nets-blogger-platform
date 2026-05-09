export class MockEmailService {
  public userConfirmationCode: string = '';
  public userEmail: string = '';
  public userRecoveryCode: string = '';

  sendRegistrationConfirmationCode(dto: { email: string; confirmationCode: string }) {
    this.userConfirmationCode = dto.confirmationCode;
    this.userEmail = dto.email;
  }

  sendPasswordRecoveryCode(dto: { email: string; recoveryCode: string }) {
    this.userRecoveryCode = dto.recoveryCode;
    this.userEmail = dto.email;
  }
}
