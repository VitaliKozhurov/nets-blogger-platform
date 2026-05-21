export interface IUpdateSessionParamsDto {
  userId: string;
  deviceId: string;
  iat: number;
  newIat: number;
  newExpirationAt: number;
}
