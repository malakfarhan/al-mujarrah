import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RolesService } from './roles.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles.view')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @Permissions('roles.view')
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Get(':id')
  @Permissions('roles.view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('roles.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, data);
  }

  @Post()
  @Permissions('roles.create')
  create(@Body() data: CreateRoleDto) {
    return this.rolesService.create(data);
  }

    @Delete(':id')
    @Permissions('roles.delete')
    remove(@Param('id', ParseIntPipe) id: number) {
  return this.rolesService.remove(id);
}


}