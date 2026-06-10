import { ICreateVerifiedUserDto } from './create-verified-user.dto';

export interface ICreateUnverifiedUserDto extends ICreateVerifiedUserDto {
  code: string;
}
