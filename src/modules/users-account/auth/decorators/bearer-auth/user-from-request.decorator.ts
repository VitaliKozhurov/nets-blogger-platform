import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserFromRequest = createParamDecorator((property: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user = request.user;

  if (!user) {
    throw new Error('No user data in request');
  }

  return property ? user[property] : user;
});
