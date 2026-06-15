import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { PasswordHasherService } from 'src/modules/crypto/password-hasher.service';
import { UsersRepository } from '../../../users/repository/users.repository';
import type { INewPasswordDto } from '../dto/new-password';

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
    const user = await this.usersRepository.findByRecoveryCode(dto.recoveryCode);

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

    const passwordHash = await this.passwordHasherService.createHash(dto.newPassword);

    const updatedUser = user.updatePassword(passwordHash);

    await this.usersRepository.save(updatedUser);

    return true;
  }
}
