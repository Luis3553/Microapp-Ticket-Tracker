import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { DbModule } from 'src/db/db.module';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';

@Module({
  imports: [DbModule],
  providers: [EventsService, EventsRepository],
  controllers: [EventsController],
})
export class EventsModule {}
