import { Request } from 'express';

import { TokenSet, UserinfoResponse } from 'openid-client';

import { OidcStrategy } from '@auth/oidc.strategy';

export interface IRequest extends Request {
  user: IUser | TokenSet | null;
  strategy: OidcStrategy | null;
}

export type IUser = UserinfoResponse & {
  permissions: string[] | [];
};
