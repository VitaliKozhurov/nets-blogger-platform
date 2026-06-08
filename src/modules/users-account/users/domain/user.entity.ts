import { BaseDBEntity } from 'src/core/db';
import { Column, Entity } from 'typeorm';
import { ICreateUserDto } from './dto/create-user.dto';

@Entity({ name: 'users' })
export class UserEntity extends BaseDBEntity {
  @Column({ type: 'varchar', length: 50 })
  login: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  static createConfirmedUser(dto: ICreateUserDto) {
    const newUser = new UserEntity();

    newUser.login = dto.login;
    newUser.passwordHash = dto.passwordHash;
    newUser.email = dto.email;

    return newUser;
  }
}
