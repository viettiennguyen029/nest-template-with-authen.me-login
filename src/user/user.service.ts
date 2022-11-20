import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';
import { UserinfoResponse } from 'openid-client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async upsertUserByUsername(userInfo: UserinfoResponse): Promise<User> {
    return this.prismaService.user.upsert({
      where: {
        username: userInfo.preferred_username,
      },
      update: {
        name: userInfo.name,
        email: userInfo.email,
        gender: userInfo.gender,
      },
      create: {
        username: userInfo.preferred_username,
        name: userInfo.name,
        email: userInfo.email,
        gender: userInfo.gender,
      },
    });
  }
}
