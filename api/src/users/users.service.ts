import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { hash } from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register-dto';
import { DbUser } from 'src/types/user';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  async create(input: RegisterDto & { role?: 'user' | 'admin' }) {
    const exists = await this.userRepo.findByEmail(input.email);
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await hash(input.password, 12);
    const user = await this.userRepo.create({
      email: input.email,
      name: input.name,
      role: input.role ?? 'user',
      passwordHash,
    });
    return user;
  }

  async findById(id: number) {
    const u = await this.userRepo.findById(id);
    return u;
  }

  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  async updateProfile(
    userId: number,
    input: { name?: string; password?: string },
  ) {
    const patch: Partial<Pick<DbUser, 'name' | 'passwordHash'>> = {};
    if (input.name) patch.name = input.name;
    if (input.password) patch.passwordHash = await hash(input.password, 12);

    const updated = await this.userRepo.update(userId, patch);
    return updated;
  }

  async list(params: { q?: string; limit?: number; offset?: number } = {}) {
    const rows = await this.userRepo.list(params);
    return rows;
  }

  async remove(userId: number) {
    await this.userRepo.remove(userId);
  }
}
