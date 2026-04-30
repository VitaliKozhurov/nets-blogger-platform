export interface IConfirmationCodeDto {
  userId: string;
  isConfirmed: boolean;
  confirmationCode: string | null;
  expirationDate: Date | null;
}
