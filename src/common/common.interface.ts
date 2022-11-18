import { Request } from 'express';

import { TokenSet, UserinfoResponse } from 'openid-client';

import { AuthStrategy } from '@auth/auth.strategy';

export interface IRequest extends Request {
  user: IUser | TokenSet | null;
  strategy: AuthStrategy | null;
}

export type IUser = UserinfoResponse & {
  permissions: string[] | [];
};
