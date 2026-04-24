import { RequestUserDto } from '../../application/dto/request-user.dto';

export interface AccessTokenPayload extends RequestUserDto {
  email: string;
}
