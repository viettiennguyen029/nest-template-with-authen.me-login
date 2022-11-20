import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@auth/auth.controller';
import { AuthStrategy, buildOpenIdClient } from '@auth/auth.strategy';
import configuration from '@config/env.default';
import { SessionSerializer } from '@auth/auth.serializer';
import { UserService } from '@user/user.service';

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (
    configService: ConfigService,
    userService: UserService,
  ) => {
    const client = await buildOpenIdClient(configService);
    const strategy = new AuthStrategy(client, configService, userService);
    return strategy;
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
  ],
  controllers: [AuthController],
  providers: [OidcStrategyFactory, SessionSerializer],
})
export class AuthModule {}
