import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../../users/repository';
import { IPasswordRecoveryDto } from '../dto';
import { UserPasswordRecoveryEvent } from '../events';

export class PasswordRecoveryCommand {
  constructor(public dto: IPasswordRecoveryDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private eventBus: EventBus,
    private usersRepository: UsersRepository
  ) {}

  async execute({ dto }: PasswordRecoveryCommand): Promise<boolean> {
    const user = await this.usersRepository.findByLoginOrEmail(dto.email);

    if (user) {
      const recoveryCode = randomUUID();
      const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

      await this.usersRepository.upsertUserPasswordRecoveryData({
        userId: user.id,
        code: recoveryCode,
        expirationDate,
      });

      this.eventBus.publish(
        new UserPasswordRecoveryEvent({
          email: user.email,
          recoveryCode,
        })
      );
    }

    return true;
  }
}
