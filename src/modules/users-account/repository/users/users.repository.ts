import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../domain/users/user.schema';
import { UserDocument, type UserModelType } from '../../domain/users/user.types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType
  ) {}

  async getById(id: string) {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async save(userDocument: UserDocument) {
    await userDocument.save();
  }
}
