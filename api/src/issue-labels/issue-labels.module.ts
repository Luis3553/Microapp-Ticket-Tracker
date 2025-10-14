import { Module } from '@nestjs/common';
import { IssueLabelsController } from './issue-labels.controller';
import { IssueLabelsService } from './issue-labels.service';
import { DbModule } from 'src/db/db.module';
import { IssueLabelsRepository } from './issue-labels.repository';

@Module({
  imports: [DbModule],
  controllers: [IssueLabelsController],
  providers: [IssueLabelsService, IssueLabelsRepository],
})
export class IssueLabelsModule {}
