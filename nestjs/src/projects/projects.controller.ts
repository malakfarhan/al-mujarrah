import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';

type AuthRequest = Request & {
  user: {
    sub: number;
    email: string;
    role: string;
  };
};

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Get all projects
  @Get()
  @Permissions('projects.view')
  findAll() {
    return this.projectsService.findAll();
  }

  // Get single project
  @Get(':id')
  @Permissions('projects.view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  // Create project
  @Post()
  @Permissions('projects.create')
  create(
    @Body() data: CreateProjectDto,
    @Req() request: AuthRequest,
  ) {
    return this.projectsService.create(
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Update project
  @Patch(':id')
  @Permissions('projects.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectDto,
    @Req() request: AuthRequest,
  ) {
    return this.projectsService.update(
      id,
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Delete project
  @Delete(':id')
  @Permissions('projects.delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    return this.projectsService.remove(
      id,
      request.user.sub,
      request.ip,
    );
  }
}