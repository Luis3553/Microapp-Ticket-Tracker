import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type AttachLabelInput } from './issue-labels.zod';
import { IssueLabelsService } from './issue-labels.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('issues/:issueId/labels')
export class IssueLabelsController {
  constructor(private readonly svc: IssueLabelsService) {}

  @Get()
  list(@Param('issueId', ParseIntPipe) issueId: number) {
    return this.svc.list(issueId);
  }

  @Post()
  attach(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: AttachLabelInput,
  ) {
    return this.svc.attach(issueId, body.labelId);
  }

  @Delete(':labelId')
  detach(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Param('labelId', ParseIntPipe) labelId: number,
  ) {
    return this.svc.detach(issueId, labelId);
  }
}
