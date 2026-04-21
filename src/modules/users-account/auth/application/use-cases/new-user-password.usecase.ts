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
    const user = await this.usersRepository.findByPasswordRecoveryCode(dto.recoveryCode);

    if (!user) {
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

    const isValidCode = user.validatePasswordRecoveryCode(dto.recoveryCode);

    if (!isValidCode) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Recovery code is expired or invalid',
        extensions: [
          {
            field: 'recoveryCode',
            message: 'Recovery code has expired',
          },
        ],
      });
    }

    const passwordHash = await this.passwordHasherService.createHash(dto.newPassword);

    const updatedUser = user.updatePassword(passwordHash);

    await this.usersRepository.save(updatedUser);

    return true;
  }
}
