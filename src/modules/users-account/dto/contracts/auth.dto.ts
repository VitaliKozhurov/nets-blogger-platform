export interface IUserLoginDto {
  loginOrEmail: string;
  password: string;
}

export interface IPasswordRecoveryDto {
  email: string;
}

export interface INewPasswordDto {
  newPassword: string;
  recoveryCode: string;
}

export interface IRegistrationDto {
  login: string;
  password: string;
  email: string;
}

export interface IRegistrationConfirmationDto {
  code: string;
}

export interface IRegistrationEmailResendingDto {
  email: string;
}
