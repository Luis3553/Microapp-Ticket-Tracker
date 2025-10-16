import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import type { RequestUser } from '../types/requests';

const cookieExtractor = (req: Request): string | null =>
  (req?.cookies?.rt as string) ?? null;

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(cfg: ConfigService) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_REFRESH_SECRET') ?? '',
      passReqToCallback: true,
    };
    super(options);
  }
  validate(req: Request, payload: AuthJwtPayload): RequestUser {
    return { id: payload.id, role: payload.role };
  }
}
