import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';
import { CreateQuotationDto } from './dto/create-quotation.dto.js';
import { UpdateQuotationDto } from './dto/update-quotation.dto.js';

@Injectable()
export class QuotationsService {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  // Get all quotations
  async findAll() {
    return db.orm.public.Quotation.all();
  }

  // Get one quotation with items
  async findOne(id: number) {
    const quotation = await db.orm.public.Quotation.first({ id });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    const items = await db.orm.public.QuotationItem
      .where({ quotationId: id })
      .all();

    return {
      ...quotation,
      items,
    };
  }

  // Create quotation
  async create(
    data: CreateQuotationDto,
    adminId: number,
    ipAddress?: string,
  ) {
    if (data.leadId !== undefined) {
      const lead = await db.orm.public.Lead.first({ id: data.leadId });

      if (!lead) {
        throw new BadRequestException('Selected lead does not exist');
      }
    }

    const subtotal = data.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );

    const discountRate = data.discountRate ?? 0;
    const discountAmount = subtotal * (discountRate / 100);

    // VAT is calculated after discount
    const taxableAmount = subtotal - discountAmount;
    const taxRate = data.taxRate ?? 0;
    const taxAmount = taxableAmount * (taxRate / 100);
    const totalAmount = taxableAmount + taxAmount;

    const quotationNo = await this.generateQuotationNo();

    const quotation = await db.orm.public.Quotation.create({
      quotationNo,
      leadId: data.leadId,

      customerName: data.customerName.trim(),
      customerNameAr: data.customerNameAr?.trim() || undefined,
      customerEmail: data.customerEmail,

      company: data.company?.trim() || undefined,
      companyAr: data.companyAr?.trim() || undefined,

      title: data.title.trim(),
      titleAr: data.titleAr?.trim() || undefined,

      description: data.description?.trim() || undefined,
      descriptionAr: data.descriptionAr?.trim() || undefined,

      currency: data.currency?.trim() || 'SAR',

      subtotal,
      discountRate,
      discountAmount,
      taxRate,
      taxAmount,
      totalAmount,

      status: 'draft',
      validUntil: data.validUntil,

      notes: data.notes?.trim() || undefined,
      notesAr: data.notesAr?.trim() || undefined,
    });

    for (const item of data.items) {
      await db.orm.public.QuotationItem.create({
        quotationId: quotation.id,
        description: item.description.trim(),
        descriptionAr: item.descriptionAr?.trim() || undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice,
      });
    }

    await this.activityLogsService.log({
      adminId,
      action: 'created',
      entityType: 'quotation',
      entityId: quotation.id,
      entityLabel: `${quotation.quotationNo} - ${quotation.title}`,
      entityLabelAr: quotation.titleAr
        ? `${quotation.quotationNo} - ${quotation.titleAr}`
        : undefined,
      ipAddress,
    });

    return this.findOne(quotation.id);
  }

  // Update quotation
  async update(
    id: number,
    data: UpdateQuotationDto,
    adminId: number,
    ipAddress?: string,
  ) {
    const quotation = await db.orm.public.Quotation.first({ id });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    if (data.leadId !== undefined) {
      const lead = await db.orm.public.Lead.first({ id: data.leadId });

      if (!lead) {
        throw new BadRequestException('Selected lead does not exist');
      }
    }

    let subtotal = quotation.subtotal;

    if (data.items !== undefined) {
      subtotal = data.items.reduce(
        (total, item) => total + item.quantity * item.unitPrice,
        0,
      );

      await this.deleteQuotationItems(id);

      for (const item of data.items) {
        await db.orm.public.QuotationItem.create({
          quotationId: id,
          description: item.description.trim(),
          descriptionAr: item.descriptionAr?.trim() || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.quantity * item.unitPrice,
        });
      }
    }

    const discountRate = data.discountRate ?? quotation.discountRate;
    const discountAmount = subtotal * (discountRate / 100);

    // VAT is calculated after discount
    const taxableAmount = subtotal - discountAmount;
    const taxRate = data.taxRate ?? quotation.taxRate;
    const taxAmount = taxableAmount * (taxRate / 100);
    const totalAmount = taxableAmount + taxAmount;

    const nextStatus = data.status ?? quotation.status;
    const statusChanged = nextStatus !== quotation.status;

    await db.orm.public.Quotation.where({ id }).update({
      leadId: data.leadId ?? quotation.leadId,

      customerName:
        data.customerName !== undefined
          ? data.customerName.trim()
          : quotation.customerName,

      customerNameAr:
        data.customerNameAr !== undefined
          ? data.customerNameAr.trim() || null
          : quotation.customerNameAr,

      customerEmail:
        data.customerEmail !== undefined
          ? data.customerEmail || null
          : quotation.customerEmail,

      company:
        data.company !== undefined
          ? data.company.trim() || null
          : quotation.company,

      companyAr:
        data.companyAr !== undefined
          ? data.companyAr.trim() || null
          : quotation.companyAr,

      title:
        data.title !== undefined
          ? data.title.trim()
          : quotation.title,

      titleAr:
        data.titleAr !== undefined
          ? data.titleAr.trim() || null
          : quotation.titleAr,

      description:
        data.description !== undefined
          ? data.description.trim() || null
          : quotation.description,

      descriptionAr:
        data.descriptionAr !== undefined
          ? data.descriptionAr.trim() || null
          : quotation.descriptionAr,

      currency:
        data.currency !== undefined
          ? data.currency.trim()
          : quotation.currency,

      subtotal,
      discountRate,
      discountAmount,
      taxRate,
      taxAmount,
      totalAmount,

      status: nextStatus,

      validUntil:
        data.validUntil !== undefined
          ? data.validUntil || null
          : quotation.validUntil,

      notes:
        data.notes !== undefined
          ? data.notes.trim() || null
          : quotation.notes,

      notesAr:
        data.notesAr !== undefined
          ? data.notesAr.trim() || null
          : quotation.notesAr,
    });

    const updated = await db.orm.public.Quotation.first({ id });

    await this.activityLogsService.log({
      adminId,
      action: statusChanged ? 'status_changed' : 'updated',
      entityType: 'quotation',
      entityId: id,
      entityLabel: `${quotation.quotationNo} - ${updated?.title || quotation.title}`,
      entityLabelAr: updated?.titleAr
        ? `${quotation.quotationNo} - ${updated.titleAr}`
        : undefined,
      ipAddress,
    });

    return this.findOne(id);
  }

  // Delete quotation
  async remove(id: number, adminId: number, ipAddress?: string) {
    const quotation = await db.orm.public.Quotation.first({ id });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    await this.deleteQuotationItems(id);

    await db.orm.public.Quotation.where({ id }).delete();

    await this.activityLogsService.log({
      adminId,
      action: 'deleted',
      entityType: 'quotation',
      entityId: id,
      entityLabel: `${quotation.quotationNo} - ${quotation.title}`,
      entityLabelAr: quotation.titleAr
        ? `${quotation.quotationNo} - ${quotation.titleAr}`
        : undefined,
      ipAddress,
    });

    return {
      message: 'Quotation deleted successfully',
    };
  }

  // Delete all quotation items safely
  private async deleteQuotationItems(quotationId: number) {
    const items = await db.orm.public.QuotationItem
      .where({ quotationId })
      .all();

    for (const item of items) {
      await db.orm.public.QuotationItem
        .where({ id: item.id })
        .delete();
    }
  }

  // Generate unique quotation number
  private async generateQuotationNo() {
    const year = new Date().getFullYear();

    for (let attempt = 0; attempt < 10; attempt++) {
      const random = Math.floor(100000 + Math.random() * 900000);
      const quotationNo = `QT-${year}-${random}`;

      const existing = await db.orm.public.Quotation.first({
        quotationNo,
      });

      if (!existing) {
        return quotationNo;
      }
    }

    throw new BadRequestException('Unable to generate quotation number');
  }
}