import { Injectable } from '@nestjs/common';
import { IssueLabelsRepository } from './issue-labels.repository';

@Injectable()
export class IssueLabelsService {
  constructor(private readonly repo: IssueLabelsRepository) {}

  list(issueId: number) {
    return this.repo.listForIssue(issueId);
  }

  attach(issueId: number, labelId: number) {
    return this.repo.attach(issueId, labelId);
  }

  detach(issueId: number, labelId: number) {
    return this.repo.detach(issueId, labelId);
  }
}
