import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LabelsRepository } from './labels.repository';
import type {
  LabelCreateInput,
  LabelListQuery,
  LabelRow,
  LabelUpdateInput,
} from './labels.zod';

@Injectable()
export class LabelsService {
  constructor(private readonly repo: LabelsRepository) {}

  async create(dto: LabelCreateInput): Promise<LabelRow> {
    const exists = await this.repo.findByName(dto.name);
    if (exists) throw new ConflictException('Name already in use');
    return this.repo.create(dto);
  }

  async list(q: LabelListQuery) {
    return this.repo.list(q);
  }

  async get(id: number) {
    const row = await this.repo.findById(id);
    if (!row) throw new NotFoundException();
    return row;
  }

  async update(id: number, dto: LabelUpdateInput) {
    if (dto.name) {
      const other = await this.repo.findByName(dto.name);
      if (other && other.id !== id)
        throw new ConflictException('Name already in use');
    }
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.repo.remove(id);
    return { success: true };
  }
}
