export interface IUserDbDto {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  deletedAt: Date | null;
}
