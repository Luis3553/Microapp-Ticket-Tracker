import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { RegisterDto } from './dto/register-dto';
import { compare } from 'bcrypt';
import { PublicUser } from 'src/types/user';
import { RequestUser } from './types/requests';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // Called by LocalStrategy
  async validateUser(email: string, password: string): Promise<PublicUser> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    const ok = await compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async register(input: RegisterDto) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new ConflictException('Email already in use');
    const created = await this.users.create({ ...input, role: 'user' });

    const user: PublicUser = {
      id: created.id,
      email: created.email,
      name: created.name,
      role: created.role,
    };
    const tokens = this.issueTokens(user);
    return { user, ...tokens };
  }

  login(user: RequestUser) {
    const tokens = this.issueTokens(user);
    return { user, ...tokens };
  }

  async refresh(userId: number) {
    const u = await this.users.findById(userId);
    if (!u) throw new UnauthorizedException();
    const user: PublicUser = {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    };
    const tokens = this.issueTokens(user);
    return { user, ...tokens };
  }

  async me(userId: number) {
    const u = await this.users.findById(userId);
    if (!u) throw new UnauthorizedException();
    const user: PublicUser = {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    };
    return user;
  }

  private issueTokens(user: RequestUser) {
    const payload: AuthJwtPayload = {
      id: user.id,
      role: user.role,
    };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRE_IN'),
    } as JwtSignOptions);
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRE_IN'),
    } as JwtSignOptions);
    return { accessToken, refreshToken };
  }
}
