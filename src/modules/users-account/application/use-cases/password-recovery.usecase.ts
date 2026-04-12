import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IPasswordRecoveryDto } from '../dto/auth/password-recovery.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserPasswordRecoveryEvent } from '../events/user-password-recovery.event';

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
      const recoveryCode = user.generatePasswordRecoveryCode();

      await this.usersRepository.save(user);

      this.eventBus.publish(
        new UserPasswordRecoveryEvent({
          email: user.email,
          recoveryCode,
        })
      );

      return true;
    }

    return false;
  }
}
