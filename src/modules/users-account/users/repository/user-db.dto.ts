export interface UserDbDto {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  isConfirmed: boolean;
  confirmationCode: string | null;
  confirmationCodeExpirationDate: Date | null;
  passwordRecoveryCode: Date | null;
  passwordRecoveryCodeExpirationDate: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
}
