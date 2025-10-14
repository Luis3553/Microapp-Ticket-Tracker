import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DbModule } from 'src/db/db.module';
import { CommentsRepository } from './comments.repository';
import { CommentsOnIssueController } from './comments.on-issue.controller';

@Module({
  imports: [DbModule],
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController, CommentsOnIssueController],
})
export class CommentsModule {}
