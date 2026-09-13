import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { LeadsModule } from './leads/leads.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RolesModule } from './roles/roles.module.js';
import { AdminsModule } from './admins/admins.module.js';
import { QuotationsModule } from './quotations/quotations.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { PortfolioModule } from './portfolio/portfolio.module.js';
import { BlogModule } from './blog/blog.module.js';
import { UploadsModule } from './uploads/uploads.module.js';
import { ActivityLogsModule } from './activity-logs/activity-logs.module.js';

@Module({
  imports: [
    LeadsModule,
    AuthModule,
    RolesModule,
    AdminsModule,
    QuotationsModule,
    ProjectsModule,
    PortfolioModule,
    BlogModule,
    UploadsModule,
    ActivityLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}