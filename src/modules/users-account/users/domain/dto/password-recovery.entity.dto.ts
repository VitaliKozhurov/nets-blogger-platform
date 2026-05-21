export interface IPasswordRecoveryEntityDto {
  userId: string;
  code: string;
  expirationDate: Date;
}
