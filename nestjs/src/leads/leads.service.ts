import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto.js';

@Injectable()
export class LeadsService {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  // Get all leads
  async findAll() {
    return db.orm.public.Lead.all();
  }

  // Get single lead
  async findOne(id: number) {
    const lead = await db.orm.public.Lead.first({ id });

    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    return lead;
  }

  // Create lead from public contact form
  async create(data: CreateLeadDto, ipAddress?: string) {
    const lead = await db.orm.public.Lead.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      budget: data.budget,
      message: data.message,
      status: 'new',
    });

    // Public lead has no adminId
    await this.activityLogsService.log({
      action: 'created',
      entityType: 'lead',
      entityId: lead.id,
      entityLabel: lead.name,
      ipAddress,
    });

    return lead;
  }

  // Update only lead status
  async updateStatus(
    id: number,
    data: UpdateLeadStatusDto,
    adminId: number,
    ipAddress?: string,
  ) {
    const lead = await db.orm.public.Lead.first({ id });

    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    await db.orm.public.Lead.where({ id }).update({
      status: data.status,
    });

    await this.activityLogsService.log({
      adminId,
      action: 'status_changed',
      entityType: 'lead',
      entityId: id,
      entityLabel: lead.name,
      ipAddress,
    });

    return db.orm.public.Lead.first({ id });
  }

  // Delete lead
  async remove(id: number, adminId: number, ipAddress?: string) {
    const lead = await db.orm.public.Lead.first({ id });

    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    await db.orm.public.Lead.where({ id }).delete();

    await this.activityLogsService.log({
      adminId,
      action: 'deleted',
      entityType: 'lead',
      entityId: id,
      entityLabel: lead.name,
      ipAddress,
    });

    return {
      message: 'Lead deleted successfully',
    };
  }
}