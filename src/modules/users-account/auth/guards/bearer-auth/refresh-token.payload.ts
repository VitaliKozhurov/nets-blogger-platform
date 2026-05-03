import type { RequestUserDto } from '../../application/dto/request-user.dto';

export interface RefreshTokenPayload extends RequestUserDto {
  deviceId: string;
  iat: number;
  exp: number;
}
