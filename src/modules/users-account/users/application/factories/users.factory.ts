import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import type { IRegistrationDto } from '../../../auth/application/dto/registration.dto';
import { UsersRepository } from '../../repository/users.repository';
import { IUserViewDto, UserViewMapper } from '../dto';
import type { ICreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../../domain/user.entity';

@Injectable()
export class UsersFactory {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService
  ) {}

  async createConfirmedUser(dto: ICreateUserDto): Promise<IUserViewDto> {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHasherService.createHash(password);

    const createdUser = UserEntity.createConfirmedUser({
      login,
      email,
      passwordHash,
    });

    await this.usersRepository.save(createdUser);

    return UserViewMapper.mapToView(createdUser);
  }

  async createUnconfirmedUser(
    dto: IRegistrationDto
  ): Promise<{ user: IUserViewDto; confirmationCode: string }> {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHasherService.createHash(password);
    const confirmationCode = randomUUID();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    const createdUser = await this.usersRepository.createUnconfirmedUser({
      login,
      email,
      passwordHash,
      confirmationCode,
      expirationDate,
    });

    return { user: UserViewMapper.mapToView(createdUser), confirmationCode };
  }
}
