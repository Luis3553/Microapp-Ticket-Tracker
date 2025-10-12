import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { RegisterDto } from './dto/register-dto';
import { compare } from 'bcrypt';
import { DbUser, PublicUser } from 'src/types/user';

const ACCESS_SECRET = process.env.JWT_SECRET as JwtSignOptions['secret'];
const REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET ||
  ACCESS_SECRET) as JwtSignOptions['secret'];
const ACCESS_TTL = (process.env.JWT_ACCESS_EXPIRES_IN ||
  '7d') as JwtSignOptions['expiresIn'];
const REFRESH_TTL = (process.env.JWT_REFRESH_EXPIRES_IN ||
  '7d') as JwtSignOptions['expiresIn'];

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // Called by LocalStrategy
  async validateUser(email: string, password: string): Promise<PublicUser> {
    const user: any = await this.users.findByEmail(email);
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    const ok = await compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async register(input: RegisterDto) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new ConflictException('Email already in use');
    const created: DbUser = await this.users.create({ ...input, role: 'user' });

    const user: PublicUser = {
      id: created.id,
      email: created.email,
      name: created.name,
      role: created.role,
    };
    const tokens = this.issueTokens(user);
    return { user, ...tokens };
  }

  async login(user: PublicUser) {
    const tokens = this.issueTokens(user);
    return { user, ...tokens };
  }

  async refresh(refreshToken: string) {
    let payload: AuthJwtPayload;
    try {
      payload = this.jwt.verify<AuthJwtPayload>(refreshToken, {
        secret: REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const u: any = await this.users.findById(payload.id);
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
    const u: any = await this.users.findById(userId);
    if (!u) throw new UnauthorizedException();
    const user: PublicUser = {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    };
    return user;
  }

  private issueTokens(user: PublicUser) {
    const payload: AuthJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwt.sign(payload, {
      secret: ACCESS_SECRET,
      expiresIn: ACCESS_TTL,
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: REFRESH_SECRET,
      expiresIn: REFRESH_TTL,
    });
    return { accessToken, refreshToken };
  }
}
