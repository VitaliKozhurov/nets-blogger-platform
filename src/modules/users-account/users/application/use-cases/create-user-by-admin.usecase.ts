import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICreateUserByAdminDto } from '../dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { UsersRepository } from '../../repository';
import { UsersService } from '../services';
import { UsersFactory } from '../factories';

export class CreateUserByAdminCommand {
  constructor(public dto: ICreateUserByAdminDto) {}
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase implements ICommandHandler<CreateUserByAdminCommand> {
  constructor(
    private usersService: UsersService,
    private userRepository: UsersRepository,
    private usersFactory: UsersFactory
  ) {}

  async execute({ dto }: CreateUserByAdminCommand): Promise<string> {
    const userExistenceCheck = await this.usersService.checkIsUserExist(dto);

    if (userExistenceCheck.isExist) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: 'User with the given email or login already exists',
        extensions: [
          {
            field: userExistenceCheck.field,
            message: 'Incorrect credentials',
          },
        ],
      });
    }

    const userByAdminDto = await this.usersFactory.createUserByAdmin(dto);
    const user = this.userRepository.create(userByAdminDto);
    // await this.userRepository.save(createdUser);

    // return createdUser._id.toString();

    return '1';
  }
}
