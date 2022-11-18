import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedGuard } from '@auth/auth.guard';
import { Response } from 'express';
import { IRequest } from 'src/common/common.interface';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('gobiz/callback')
  loginCallback(@Req() req: IRequest, @Res() res: Response) {
    return res.redirect(
      `${this.configService.get<string>(
        'OAUTH2_CLIENT_LOGIN_SUCCESS_REDIRECT',
      )}?access-token=${req.user.access_token}&expires-at=${
        req.user.expires_at
      }`,
    );
  }
}
