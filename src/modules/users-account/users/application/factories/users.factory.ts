import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { IRegistrationDto } from '../../../auth/application/dto';
import { UsersRepository } from '../../repository';
import { ICreateUserByAdminDto } from '../dto';

@Injectable()
export class UsersFactory {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService
  ) {}

  async createUnconfirmedUser(dto: IRegistrationDto) {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHasherService.createHash(password);
    const confirmationCode = randomUUID();
    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);

    const createdUser = await this.usersRepository.createWithUnconfirmedStatus({
      login,
      email,
      passwordHash,
      confirmationCode,
      expirationDate,
    });

    return { createdUser, confirmationCode };
  }

  async createUserByAdmin(dto: ICreateUserByAdminDto) {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHasherService.createHash(password);

    const createdUser = await this.usersRepository.createWithConfirmedStatus({
      login,
      email,
      passwordHash,
    });

    return createdUser;
  }
}
