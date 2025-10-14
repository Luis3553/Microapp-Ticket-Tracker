import { Module } from '@nestjs/common';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';
import { DbModule } from 'src/db/db.module';
import { LabelsRepository } from './labels.repository';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Module({
  imports: [DbModule],
  controllers: [LabelsController],
  providers: [LabelsService, LabelsRepository, JwtAuthGuard],
  exports: [LabelsService],
})
export class LabelsModule {}
