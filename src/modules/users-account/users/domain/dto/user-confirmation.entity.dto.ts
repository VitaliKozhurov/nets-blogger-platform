export interface IUserConfirmationEntityDto {
  userId: string;
  isConfirmed: boolean;
  confirmationCode: string | null;
  expirationDate: Date | null;
}
