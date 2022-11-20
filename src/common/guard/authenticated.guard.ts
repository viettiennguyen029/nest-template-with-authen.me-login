import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { OidcStrategy } from '@auth/oidc.strategy';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http: HttpArgumentsHost = context.switchToHttp();
    const request: Request = http.getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    try {
      const accessToken: string = request.headers.authorization.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedException();
      }
      const userinfo = await OidcStrategy.client.userinfo(accessToken);
      request['user'] = userinfo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new UnauthorizedException(error);
    }
    return true;
  }
}
