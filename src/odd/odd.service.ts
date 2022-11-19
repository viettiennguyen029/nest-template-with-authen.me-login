import { Injectable } from '@nestjs/common';
import { Odd } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';

@Injectable()
export class OddService {
  constructor(private prismaService: PrismaService) {}

  async getOdds(): Promise<Odd[]> {
    return await this.prismaService.odd.findMany({
      include: {
        match: true,
      },
    });
  }
}
