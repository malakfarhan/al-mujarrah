import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.admin_token;

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      (request as Request & { user?: unknown }).user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}