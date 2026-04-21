import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { User } from '../../domain';
import { type UserModelType } from '../../domain';
import { IRegistrationDto } from '../../../auth/application/dto';
import { ICreateUserByAdminDto } from '../dto';

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

  async createUserByAdmin(dto: ICreateUserByAdminDto) {
    const passwordHash = await this.passwordHasherService.createHash(dto.password);

    const createdUser = await this.UserModel.createUserInstance({
      login: dto.login,
      email: dto.email,
      passwordHash,
    });

    return createdUser;
  }
}
