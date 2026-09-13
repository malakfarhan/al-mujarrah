import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AdminsService } from './admins.service.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';

@Controller('admins')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // Get all admin users
  @Get()
  @Permissions('admins.view')
  findAll() {
    return this.adminsService.findAll();
  }

  // Update admin user
  @Patch(':id')
  @Permissions('admins.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAdminDto,
  ) {
    return this.adminsService.update(id, data);
  }

  // Create new admin user
  @Post()
  @Permissions('admins.create')
  create(@Body() data: CreateAdminDto) {
    return this.adminsService.create(data);
  }
}