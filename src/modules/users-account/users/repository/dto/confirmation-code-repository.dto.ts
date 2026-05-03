export interface IConfirmationCodeRepositoryDto {
  userId: string;
  isConfirmed: boolean;
  confirmationCode: string | null;
  expirationDate: Date | null;
}
