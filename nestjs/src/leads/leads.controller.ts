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

import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto.js';
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

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // Get all leads
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leads.view')
  findAll() {
    return this.leadsService.findAll();
  }

  // Get single lead
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leads.view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.findOne(id);
  }

  // Update lead status
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leads.update')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateLeadStatusDto,
    @Req() request: AuthRequest,
  ) {
    return this.leadsService.updateStatus(
      id,
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Delete lead
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leads.delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    return this.leadsService.remove(
      id,
      request.user.sub,
      request.ip,
    );
  }

  // Public contact form
  @Post()
  create(
    @Body() data: CreateLeadDto,
    @Req() request: Request,
  ) {
    return this.leadsService.create(data, request.ip);
  }
}