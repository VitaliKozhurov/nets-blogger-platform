import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { UsersRepository } from '../../infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { IRegistrationDto } from '../dto/auth/registration';
import { UserRegistrationEvent } from '../events/user-registration.event';
import { UsersFactory } from '../factories/users.factory';

export class RegistrationUserCommand {
  constructor(public dto: IRegistrationDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
  constructor(
    private eventBus: EventBus,
    private authService: AuthService,
    private usersFactory: UsersFactory,
    private userRepository: UsersRepository
  ) {}

  async execute({ dto }: RegistrationUserCommand): Promise<boolean> {
    const { login, email } = dto;

    const checkIsExist = await this.authService.checkIsUserExist({ login, email });

    if (checkIsExist.isExist) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User with the given email or login already exists',
        extensions: [{ field: checkIsExist.field, message: 'Incorrect credentials' }],
      });
    }

    const createdUser = await this.usersFactory.createUnconfirmedUser(dto);

    await this.userRepository.save(createdUser);

    this.eventBus.publish(
      new UserRegistrationEvent(
        createdUser.email,
        createdUser.emailConfirmation.confirmationCode ?? ''
      )
    );

    return true;
  }
}
