import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '@user/user.service';
import { Client, Issuer, Strategy, TokenSet } from 'openid-client';

export const buildOpenIdClient = async (config: ConfigService) => {
  const TrustIssuer = await Issuer.discover(
    `${config.get<string>(
      'OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER',
    )}/.well-known/openid-configuration`,
  );
  const client = new TrustIssuer.Client({
    client_id: config.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID'),
    client_secret: config.get<string>(
      'OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET',
    ),
  });
  return client;
};

export class AuthStrategy extends PassportStrategy(Strategy, 'oidc') {
  static client: Client;

  constructor(
    client: Client,
    config: ConfigService,
    private userService: UserService,
  ) {
    super({
      client: client,
      params: {
        redirect_uri: config.get<string>(
          'OAUTH2_CLIENT_REGISTRATION_LOGIN_REDIRECT_URI',
        ),
        scope: config.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_SCOPE'),
      },
      passReqToCallback: false,
      usePKCE: false,
    });
    AuthStrategy.client = client;
  }

  async validate(tokenset: TokenSet): Promise<any> {
    const userinfo = await AuthStrategy.client.userinfo(tokenset.access_token);
    try {
      // const id_token = tokenset.id_token;
      // const access_token = tokenset.access_token;
      // const refresh_token = tokenset.refresh_token;
      // const user = {
      //   id_token,
      //   access_token,
      //   refresh_token,
      //   userinfo,
      // };
      await this.userService.upsertUserByUsername(userinfo);
      return tokenset;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
