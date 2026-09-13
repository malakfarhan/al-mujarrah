import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { QuotationsService } from './quotations.service.js';
import { QuotationPdfService } from './quotation-pdf.service.js';
import { CreateQuotationDto } from './dto/create-quotation.dto.js';
import { UpdateQuotationDto } from './dto/update-quotation.dto.js';
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

@Controller('quotations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class QuotationsController {
  constructor(
    private readonly quotationsService: QuotationsService,
    private readonly quotationPdfService: QuotationPdfService,
  ) {}

  // Get all quotations
  @Get()
  @Permissions('quotations.view')
  findAll() {
    return this.quotationsService.findAll();
  }

  // Download English or Arabic quotation PDF
  @Get(':id/pdf')
  @Permissions('quotations.view')
  async downloadPdf(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang: string = 'en',
    @Res() response: Response,
  ) {
    if (lang !== 'en' && lang !== 'ar') {
      throw new BadRequestException('PDF language must be en or ar');
    }

    const quotation = await this.quotationsService.findOne(id);
    const pdfBuffer = await this.quotationPdfService.generate(
      quotation,
      lang,
    );

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${quotation.quotationNo}-${lang}.pdf"`,
    );
    response.setHeader('Content-Length', pdfBuffer.length);
    response.end(pdfBuffer);
  }

  // Get one quotation with items
  @Get(':id')
  @Permissions('quotations.view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsService.findOne(id);
  }

  // Create new quotation
  @Post()
  @Permissions('quotations.create')
  create(
    @Body() data: CreateQuotationDto,
    @Req() request: AuthRequest,
  ) {
    return this.quotationsService.create(
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Update quotation
  @Patch(':id')
  @Permissions('quotations.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateQuotationDto,
    @Req() request: AuthRequest,
  ) {
    return this.quotationsService.update(
      id,
      data,
      request.user.sub,
      request.ip,
    );
  }

  // Delete quotation
  @Delete(':id')
  @Permissions('quotations.delete')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    return this.quotationsService.remove(
      id,
      request.user.sub,
      request.ip,
    );
  }
}