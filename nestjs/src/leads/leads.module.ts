import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from './leads.service.js';

@Module({
  imports: [
    AuthModule,
    ActivityLogsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}