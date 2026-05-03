import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import type { IRegistrationDto } from '../../../auth/application/dto/registration.dto';
import { UsersRepository } from '../../repository/users.repository';
import type { ICreateUserByAdminDto } from '../dto/create-user-by-admin.dto';

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
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

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
