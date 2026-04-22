export interface CreateDeviceSessionInstanceDto {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat: number;
  expirationAt: number;
}
