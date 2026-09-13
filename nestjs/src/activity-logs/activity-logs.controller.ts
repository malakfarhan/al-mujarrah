import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { ActivityLogsService } from './activity-logs.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  // Admin: view activity logs
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.view')
  findAll() {
    return this.activityLogsService.findAll();
  }
}