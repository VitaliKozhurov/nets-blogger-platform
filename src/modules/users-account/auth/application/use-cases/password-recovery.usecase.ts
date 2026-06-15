import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/repository/users.repository';
import type { IPasswordRecoveryDto } from '../dto/password-recovery.dto';
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
      const updatedUser = user.generatePasswordRecoveryCode();
      const savedUser = await this.usersRepository.save(updatedUser);

      if (savedUser.recoveryCode) {
        this.eventBus.publish(
          new UserPasswordRecoveryEvent({
            email: savedUser.email,
            recoveryCode: savedUser.recoveryCode.code,
          })
        );
      }
    }

    return true;
  }
}
