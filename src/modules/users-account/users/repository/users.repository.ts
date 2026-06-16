import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../domain/user.entity';
import { UserConfirmationEntity } from '../domain/user-confirmation.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    @InjectRepository(UserConfirmationEntity)
    private usersConfirmationRepo: Repository<UserConfirmationEntity>
  ) {}

  async save(user: UserEntity) {
    return await this.usersRepo.save(user);
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
    const user = await this.usersRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
      withDeleted: false,
      relations: {
        confirmation: true,
        passwordRecovery: true,
      },
    });

    return user;
  }

  async findByRecoveryCode(code: string): Promise<UserEntity | null> {
    const user = await this.usersRepo.findOne({
      where: { passwordRecovery: { code } },
      relations: {
        confirmation: true,
        passwordRecovery: true,
      },
    });

    return user;
  }

  async softDelete(userId: string): Promise<boolean> {
    const { affected } = await this.usersRepo.softDelete({ id: userId });

    return affected === 1;
  }

  async confirmRegistrationByCode(code: string) {
    const { affected } = await this.usersConfirmationRepo.update(
      { code },
      { isConfirmed: true, code: null, expirationDate: null }
    );

    return affected === 1;
  }

  // async findById(id: string): Promise<IUserEntityDto | null> {
  //   const [user]: IUserEntityDto[] = await this.dataSource.query(
  //     `
  //     SELECT *
  //       FROM users
  //       WHERE users.id = $1 AND "deletedAt" IS NULL
  //     `,
  //     [id]
  //   );

  //   return user || null;
  // }

  // async findByIdOrThrow(id: string): Promise<IUserEntityDto> {
  //   const user = await this.findById(id);

  //   if (!user) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.NOT_FOUND_ERROR,
  //       message: 'User not found',
  //     });
  //   }

  //   return user;
  // }
}
