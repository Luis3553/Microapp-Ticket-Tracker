import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IssuesService } from './issues.service';
import {
  type IssueCreateInput,
  type IssueUpdateInput,
  type IssueListQuery,
} from './issues.zod';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/types/requests';

@UseGuards(JwtAuthGuard)
@Controller('issues')
export class IssuesController {
  constructor(private readonly svc: IssuesService) {}

  @Get()
  list(@Query() q: IssueListQuery) {
    return this.svc.list(q);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.svc.get(id);
  }

  @Post()
  create(@Body() dto: IssueCreateInput, @Req() req: RequestWithUser) {
    const reporterId = req.user.id;
    return this.svc.create(dto, reporterId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IssueUpdateInput,
    @Req() req: RequestWithUser,
  ) {
    const actorId = req.user.id;
    return this.svc.update(id, dto, actorId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    const actorId = req.user.id;
    return this.svc.remove(id, actorId);
  }
}
