import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ICreateUserDto } from '../dto/create-user.dto';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { isUniqueEntityError } from 'src/core/utils/predicates/isUniqueEntityError';
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
      console.log('ERROR: ', error);

      if (isUniqueEntityError(error)) {
        throw new DomainException({
          code: DomainExceptionCode.BAD_REQUEST_ERROR,
          message: 'User with the given email already exists',
          extensions: [
            {
              field: 'email',
              message: 'User with this email already exists',
            },
          ],
        });
      }

      throw error;
    }
  }
}
