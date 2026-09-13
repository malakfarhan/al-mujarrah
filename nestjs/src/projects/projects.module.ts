import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

@Module({
  imports: [
    AuthModule,
    ActivityLogsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}