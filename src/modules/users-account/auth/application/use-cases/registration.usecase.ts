import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { UsersRepository } from '../../../users/repository';
import { IRegistrationDto } from '../dto';
import { UserRegistrationEvent } from '../events';
import { UsersFactory } from '../../../users/application/factories';
import { UsersService } from '../../../users/application/services';

export class RegistrationCommand {
  constructor(public dto: IRegistrationDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private eventBus: EventBus,
    private usersService: UsersService,
    private usersFactory: UsersFactory,
    private usersRepository: UsersRepository
  ) {}

  async execute({ dto }: RegistrationCommand): Promise<boolean> {
    const { login, email } = dto;

    const checkIsExist = await this.usersService.checkIsUserExist({ login, email });

    if (checkIsExist.isExist) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User with the given email or login already exists',
        extensions: [{ field: checkIsExist.field, message: 'Incorrect credentials' }],
      });
    }

    const createdUser = await this.usersFactory.createUnconfirmedUser(dto);

    await this.usersRepository.save(createdUser);

    this.eventBus.publish(
      new UserRegistrationEvent({
        email: createdUser.email,
        confirmationCode: createdUser.emailConfirmation.confirmationCode ?? '',
      })
    );

    return true;
  }
}
