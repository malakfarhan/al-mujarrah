import { Module } from '@nestjs/common';

import { AdminsController } from './admins.controller.js';
import { AdminsService } from './admins.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}