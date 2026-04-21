import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IRegistrationConfirmationDto } from '../dto';
import { UsersRepository } from '../../../users/repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class RegistrationConfirmationCommand {
  constructor(public dto: IRegistrationConfirmationDto) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
  constructor(private userRepository: UsersRepository) {}

  async execute({ dto }: RegistrationConfirmationCommand) {
    const user = await this.userRepository.findByRegistrationConfirmationCode(dto.code);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Confirmation code is invalid',
        extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
      });
    }

    const isValidCode = user.validateRegistrationConfirmationCode(dto.code);

    if (!isValidCode) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'Confirmation code is invalid',
        extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
      });
    }

    const updatedUser = user.confirmRegistration();

    await this.userRepository.save(updatedUser);

    return true;
  }
}
