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

import { PortfolioService } from './portfolio.service.js';
import { CreatePortfolioDto } from './dto/create-portfolio.dto.js';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto.js';
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

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Public frontend: published portfolio list
  @Get('public')
  findPublished() {
    return this.portfolioService.findPublished();
  }

  // Public frontend: published portfolio by slug
  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.portfolioService.findBySlug(slug);
  }

  // Admin: all portfolio items
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.view')
  findAll() {
    return this.portfolioService.findAll();
  }

  // Admin: single portfolio item
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.findOne(id);
  }

  // Admin: create portfolio item
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.create')
  create(
    @Body() data: CreatePortfolioDto,
    @Req() request: AuthRequest,
  ) {
    return this.portfolioService.create(
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Admin: update portfolio item
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePortfolioDto,
    @Req() request: AuthRequest,
  ) {
    return this.portfolioService.update(
      id,
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Admin: delete portfolio item
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    return this.portfolioService.remove(
      id,
      request.user.sub,
      request.ip,
    );
  }
}