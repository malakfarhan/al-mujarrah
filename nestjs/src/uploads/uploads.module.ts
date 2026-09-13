import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { UploadsController } from './uploads.controller.js';
import { UploadsService } from './uploads.service.js';

@Module({
  imports: [
    // Required for JwtAuthGuard / JwtService
    AuthModule,
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}