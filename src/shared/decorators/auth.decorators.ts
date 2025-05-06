import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RoleNames } from 'src/api/user/enums';
import { User } from 'src/api/user/schemas/user.schema';

export const Roles = Reflector.createDecorator<RoleNames[]>();

export const IsPublic = Reflector.createDecorator();

export const Auth = createParamDecorator(
  (props: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    return props ? req['user'][props] : req['user'];
  },
);
