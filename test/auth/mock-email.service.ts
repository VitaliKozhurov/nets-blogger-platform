export class MockEmailService {
  public userConfirmationCode: string = '';
  public userEmail: string = '';

  sendRegistrationConfirmationCode(dto: { email: string; confirmationCode: string }) {
    this.userConfirmationCode = dto.confirmationCode;
    this.userEmail = dto.email;
    console.log(`Send registration data: ${JSON.stringify(dto)}`);
  }

  sendPasswordRecoveryCode(dto: { email: string; recoveryCode: string }) {
    console.log(`Send recovery data: ${JSON.stringify(dto)}`);
  }
}
