import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { type CommentCreateInput, type CommentListQuery } from './comments.zod';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/types/requests';

@UseGuards(JwtAuthGuard)
@Controller('issues/:issueId/comments')
export class CommentsOnIssueController {
  constructor(private readonly svc: CommentsService) {}

  @Get()
  list(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Query() q: CommentListQuery,
  ) {
    return this.svc.list(issueId, q);
  }

  @Post()
  add(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: CommentCreateInput,
    @Req() req: RequestWithUser,
  ) {
    const authorId = req.user.id;
    return this.svc.add(issueId, authorId, body);
  }
}
