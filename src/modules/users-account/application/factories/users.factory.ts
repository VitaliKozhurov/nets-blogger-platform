import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../../domain/users/user.schema';
import { type UserModelType } from '../../domain/users/user.types';
import { IRegistrationDto } from '../dto/auth/registration.dto';

@Injectable()
export class UsersFactory {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private passwordHasherService: PasswordHasherService
  ) {}

  async createUnconfirmedUser(dto: IRegistrationDto) {
    const passwordHash = await this.passwordHasherService.createHash(dto.password);

    const createdUser = await this.UserModel.createUnconfirmedUserInstance({
      login: dto.login,
      email: dto.email,
      passwordHash,
    });

    return createdUser;
  }
}
