import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@auth/auth.controller';
import { OidcStrategy, buildOpenIdClient } from '@auth/oidc.strategy';
import configuration from '@config/env.default';
import { SessionSerializer } from '@auth/auth.serializer';
import { UserService } from '@user/user.service';
import { UserModule } from '@user/user.module';

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (
    configService: ConfigService,
    userService: UserService,
  ) => {
    const client = await buildOpenIdClient(configService);
    const strategy = new OidcStrategy(client, configService, userService);
    return strategy;
  },
  inject: [ConfigService, UserService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [OidcStrategyFactory, SessionSerializer],
})
export class AuthModule {}
