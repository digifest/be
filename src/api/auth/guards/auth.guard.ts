import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/api/user/schemas/user.schema';
import { Auth } from '../schemas/auth.schema';
import { IsPublic, Roles } from 'src/shared/decorators/auth.decorators';
import { Request } from 'express';
import { isAfter } from 'date-fns';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const is_public_route = this.reflector.get(IsPublic, context.getHandler());

    if (is_public_route) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const access_token = request.headers['authorization']?.split(' ')?.[1];

    if (!access_token) throw new UnauthorizedException('Unauthorized');

    const decoded_token = await this.jwtService.verifyAsync<{ userId: string }>(
      access_token as string,
    );

    if (!decoded_token) throw new UnauthorizedException('Unauthorized');

    const auth = await this.authModel.findOne({ user: decoded_token.userId });

    if (
      !auth ||
      auth.access_token != access_token ||
      isAfter(new Date(), auth.access_token_expires)
    )
      throw new UnauthorizedException('Unauthorized, expired token');

    const user = await this.userModel.findById(decoded_token.userId);

    if (!user) throw new UnauthorizedException('Unauthorized');

    const accepted_roles = this.reflector.get(Roles, context.getHandler());

    if (!isEmpty(accepted_roles) && !accepted_roles.includes(user.role))
      throw new UnauthorizedException('Unauthorized');

    request.user = user;
    return true;
  }
}
