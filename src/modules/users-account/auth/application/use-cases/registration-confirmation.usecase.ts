import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { UsersRepository } from '../../../users/repository';
import { IRegistrationConfirmationDto } from '../dto';

export class RegistrationConfirmationCommand {
  constructor(public dto: IRegistrationConfirmationDto) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ dto }: RegistrationConfirmationCommand) {
    const isUpdating = await this.usersRepository.confirmUserRegistrationByCode(dto.code);

    if (!isUpdating) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Confirmation code is invalid, already used, or expired',
        extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
      });
    }

    return true;
  }
}
