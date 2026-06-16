import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDeviceSessionEntity } from '../domain/user-device-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceSessionsQueryRepository {
  constructor(
    @InjectRepository(UserDeviceSessionEntity)
    private userDeviceSessionsRepo: Repository<UserDeviceSessionEntity>
  ) {}

  async findAllByUser(userId: string): Promise<UserDeviceSessionEntity[]> {
    const sessions = await this.userDeviceSessionsRepo.find({ where: { userId } });

    return sessions;
  }
}
