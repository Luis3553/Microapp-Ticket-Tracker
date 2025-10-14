import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import type { RequestWithUser } from 'src/auth/types/requests';

@Controller('comments')
export class CommentsController {
  constructor(private readonly svc: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    const actorId = req.user.id;
    const role = req.user.role as 'user' | 'admin';
    return this.svc.remove(id, actorId, role);
  }
}
