import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { PortfolioController } from './portfolio.controller.js';
import { PortfolioService } from './portfolio.service.js';

@Module({
  imports: [
    AuthModule,
    ActivityLogsModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}