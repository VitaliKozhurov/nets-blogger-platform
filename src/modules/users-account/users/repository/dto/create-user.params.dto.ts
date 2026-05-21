export type CreateUserDto =
  | {
      login: string;
      email: string;
      passwordHash: string;
      isConfirmed: true;
    }
  | {
      login: string;
      email: string;
      passwordHash: string;
      isConfirmed: false;
      confirmationCode: string;
      expirationDate: Date;
    };
