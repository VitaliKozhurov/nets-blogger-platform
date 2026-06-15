import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import type { IRegistrationDto } from '../../../auth/application/dto/registration.dto';
import { UsersRepository } from '../../repository/users.repository';
import { ICreateUserCommandDto, IUserViewDto, UserViewMapper } from '../dto';
import { UserEntity } from '../../domain/user.entity';

@Injectable()
export class UsersFactory {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService
  ) {}

  async createVerifiedUser(dto: ICreateUserCommandDto): Promise<IUserViewDto> {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHasherService.createHash(password);

    const createdUser = UserEntity.createVerifiedUser({
      login,
      email,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(createdUser);

    return UserViewMapper.mapToView({
      id: savedUser.id,
      login: savedUser.login,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    });
  }

  async createUnconfirmedUser(
    dto: IRegistrationDto
  ): Promise<{ email: string; confirmationCode: string }> {
    const { login, email, password } = dto;

    const passwordHash = await this.passwordHasherService.createHash(password);

    const createdUser = UserEntity.createUnverifiedUser({
      login,
      email,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(createdUser);

    return {
      email: savedUser.email,
      confirmationCode: savedUser.confirmation.code as string,
    };
  }
}
