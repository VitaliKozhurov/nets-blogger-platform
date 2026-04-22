import { RequestUserDto } from '../../application';

export interface RefreshTokenPayload extends RequestUserDto {
  deviceId: string;
  iat: number;
  exp: number;
}
