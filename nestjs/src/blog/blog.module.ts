import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { BlogController } from './blog.controller.js';
import { BlogService } from './blog.service.js';

@Module({
  imports: [
    AuthModule,
    ActivityLogsModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}