import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/repository';
import { INewPasswordDto } from '../dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';

export class NewUserPasswordCommand {
  constructor(public dto: INewPasswordDto) {}
}

@CommandHandler(NewUserPasswordCommand)
export class NewUserPasswordUseCase implements ICommandHandler<NewUserPasswordCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService
  ) {}

  async execute({ dto }: NewUserPasswordCommand): Promise<boolean> {
    const passwordRecoveryData = await this.usersRepository.findPasswordRecoveryData(
      dto.recoveryCode
    );

    if (!passwordRecoveryData) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Recovery code is invalid',
        extensions: [
          {
            field: 'recoveryCode',
            message: 'Invalid recovery code',
          },
        ],
      });
    }

    const passwordHash = await this.passwordHasherService.createHash(dto.newPassword);

    const isUpdated = await this.usersRepository.updateUserPassword({
      userId: passwordRecoveryData.userId,
      passwordHash,
    });

    if (!isUpdated) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Recovery code is invalid',
        extensions: [
          {
            field: 'recoveryCode',
            message: 'Invalid recovery code',
          },
        ],
      });
    }

    await this.usersRepository.deletePasswordRecoveryData(passwordRecoveryData.userId);

    return true;
  }
}
