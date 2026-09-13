import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { ActivityLogsController } from './activity-logs.controller.js';
import { ActivityLogsService } from './activity-logs.service.js';

@Module({
  imports: [AuthModule],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}