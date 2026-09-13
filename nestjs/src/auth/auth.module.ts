import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { PermissionsGuard } from './guards/permissions.guard.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env['JWT_SECRET']!,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [
    JwtModule,
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class AuthModule {}