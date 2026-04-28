import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { IRegistrationDto } from '../../../auth/application/dto';
import { ICreateUserByAdminDto } from '../dto';
import { UsersRepository } from '../../repository';

@Injectable()
export class UsersFactory {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService
  ) {}

  async createUnconfirmedUser(dto: IRegistrationDto) {
    const passwordHash = await this.passwordHasherService.createHash(dto.password);

    // const createdUser = await this.UserModel.createUnconfirmedUserInstance({
    //   login: dto.login,
    //   email: dto.email,
    //   passwordHash,
    // });

    // return createdUser;

    return {
      login: 'string',
      password: 'string',
      email: 'string',
    };
  }

  async createUserByAdmin(dto: ICreateUserByAdminDto) {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHasherService.createHash(password);

    const createdUser = await this.usersRepository.createByAdmin({ login, email, passwordHash });

    return createdUser;
  }
}
