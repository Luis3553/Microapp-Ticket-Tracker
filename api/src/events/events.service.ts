import { Injectable } from '@nestjs/common';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(private readonly repo: EventsRepository) {}
  list(issueId: number) {
    return this.repo.listForIssue(issueId);
  }
}
