import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma_module/prisma.module';
import { OddController } from '@odd/odd.controller';
import { OddService } from '@odd/odd.service';

@Module({
  imports: [PrismaModule],
  controllers: [OddController],
  providers: [OddService],
})
export class OddModule {}
