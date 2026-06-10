import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ICreateUserDto } from '../dto/create-user.dto';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { isUniqueEntityError } from 'src/core/utils/predicates/isUniqueEntityError';
import { USER_UNIQUE_CONSTRAINTS } from '../../domain/user.constraint';
import type { IUserViewDto } from '../dto';
import { UsersFactory } from '../factories/users.factory';

export class CreateUserCommand extends Command<IUserViewDto> {
  constructor(public dto: ICreateUserDto) {
    super();
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private usersFactory: UsersFactory) {}

  async execute({ dto }: CreateUserCommand): Promise<IUserViewDto> {
    try {
      const newUser = await this.usersFactory.createConfirmedUser(dto);

      return newUser;
    } catch (error) {
      if (isUniqueEntityError(error)) {
        const constraint = error.driverError.constraint as keyof typeof USER_UNIQUE_CONSTRAINTS;

        if (!USER_UNIQUE_CONSTRAINTS[constraint]) {
          throw error;
        }

        throw new DomainException({
          code: DomainExceptionCode.BAD_REQUEST_ERROR,
          message: 'User with provided credentials already exists',
          extensions: [USER_UNIQUE_CONSTRAINTS[constraint]],
        });
      }

      throw error;
    }
  }
}
