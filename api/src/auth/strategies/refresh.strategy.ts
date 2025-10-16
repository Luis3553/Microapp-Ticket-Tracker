import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AuthJwtPayload } from '../types/auth-jwtPayload';

const cookieExtractor = (req: Request) => req?.cookies?.rt ?? null;

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
  validate(req: Request, payload: AuthJwtPayload) {
    return { id: payload.id, role: payload.role };
  }
}
