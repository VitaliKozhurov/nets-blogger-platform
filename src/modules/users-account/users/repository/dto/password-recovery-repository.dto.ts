export interface IPasswordRecoveryRepositoryDto {
  userId: string;
  code: string;
  expirationDate: Date;
}
