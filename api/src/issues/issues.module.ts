import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { IssuesRepository } from './issues.repository';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [IssuesController],
  providers: [IssuesService, IssuesRepository],
  exports: [IssuesService],
})
export class IssuesModule {}
