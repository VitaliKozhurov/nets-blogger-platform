import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserDocument, type UserModuleType } from '../domain/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModuleType
  ) {}

  async getById(id: string) {
    const user = await this.UserModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async save(userDocument: UserDocument) {
    await userDocument.save();
  }
}
