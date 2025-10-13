import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectListQuerySchema } from './projects.zod';
import { createZodDto } from 'nestjs-zod';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

class ListQueryDto extends createZodDto(ProjectListQuerySchema) {}

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly svc: ProjectsService) {}

  @Get()
  list(@Query() qdto: ListQueryDto) {
    const { q, limit, offset } = qdto;
    return this.svc.list(q, limit, offset);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.svc.get(id);
  }

  @Get('key/:key')
  getByKey(@Param('key') key: string) {
    return this.svc.getByKey(key);
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
