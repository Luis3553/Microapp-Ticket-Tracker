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
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import {
  type LabelCreateInput,
  type LabelListQuery,
  type LabelUpdateInput,
} from './labels.zod';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('labels')
export class LabelsController {
  constructor(private readonly svc: LabelsService) {}

  @Get()
  list(@Query() q: LabelListQuery) {
    return this.svc.list(q);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.svc.get(id);
  }

  @Post()
  create(@Body() dto: LabelCreateInput) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: LabelUpdateInput) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
