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

import { BlogService } from './blog.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
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

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Public: published blog posts
  @Get('public')
  findPublished() {
    return this.blogService.findPublished();
  }

  // Public: published blog post by slug
  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  // Admin: all blog posts
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.view')
  findAll() {
    return this.blogService.findAll();
  }

  // Admin: single blog post
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  // Admin: create blog post
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.create')
  create(
    @Body() data: CreateBlogDto,
    @Req() request: AuthRequest,
  ) {
    return this.blogService.create(
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Admin: update blog post
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBlogDto,
    @Req() request: AuthRequest,
  ) {
    return this.blogService.update(
      id,
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Admin: delete blog post
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('projects.delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    return this.blogService.remove(
      id,
      request.user.sub,
      request.ip,
    );
  }
}