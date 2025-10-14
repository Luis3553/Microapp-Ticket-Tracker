import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('issues/:issueId/events')
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  @Get()
  list(@Param('issueId', ParseIntPipe) issueId: number) {
    return this.svc.list(issueId);
  }
}
