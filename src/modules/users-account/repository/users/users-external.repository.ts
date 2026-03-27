import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../domain/users/user.schema';
import { type UserModelType } from '../../domain/users/user.types';

@Injectable()
export class UsersExternalRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType
  ) {}

  async delete() {
    await this.UserModel.deleteMany();
  }
}
