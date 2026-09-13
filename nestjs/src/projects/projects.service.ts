import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  // Get all projects
  async findAll() {
    return db.orm.public.Project.all();
  }

  // Get single project
  async findOne(id: number) {
    const project = await db.orm.public.Project.first({ id });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Create project manually or from accepted quotation
  async create(
    data: CreateProjectDto,
    adminId: number,
    ipAddress?: string,
  ) {
    let quotation = null;

    if (data.quotationId !== undefined) {
      quotation = await db.orm.public.Quotation.first({
        id: data.quotationId,
      });

      if (!quotation) {
        throw new BadRequestException('Selected quotation does not exist');
      }

      if (quotation.status !== 'accepted') {
        throw new BadRequestException(
          'Only accepted quotations can be converted into projects',
        );
      }

      const existingProject = await db.orm.public.Project.first({
        quotationId: data.quotationId,
      });

      if (existingProject) {
        throw new BadRequestException(
          'A project already exists for this quotation',
        );
      }
    }

    const projectNo = await this.generateProjectNo();

    const clientName =
      data.clientName?.trim() || quotation?.customerName?.trim();

    const title =
      data.title?.trim() || quotation?.title?.trim();

    if (!clientName || !title) {
      throw new BadRequestException(
        'Client name and project title are required',
      );
    }

    const status = data.status ?? 'planning';
    const progress =
      status === 'completed' ? 100 : (data.progress ?? 0);

    const project = await db.orm.public.Project.create({
      projectNo,
      quotationId: data.quotationId,

      clientName,
      clientNameAr:
        data.clientNameAr?.trim() ||
        quotation?.customerNameAr?.trim() ||
        undefined,

      company:
        data.company?.trim() ||
        quotation?.company?.trim() ||
        undefined,

      companyAr:
        data.companyAr?.trim() ||
        quotation?.companyAr?.trim() ||
        undefined,

      title,
      titleAr:
        data.titleAr?.trim() ||
        quotation?.titleAr?.trim() ||
        undefined,

      description:
        data.description?.trim() ||
        quotation?.description?.trim() ||
        undefined,

      descriptionAr:
        data.descriptionAr?.trim() ||
        quotation?.descriptionAr?.trim() ||
        undefined,

      status,
      priority: data.priority ?? 'medium',
      progress,

      budget:
        data.budget ??
        quotation?.totalAmount ??
        0,

      currency:
        data.currency?.trim() ||
        quotation?.currency ||
        'SAR',

      startDate: data.startDate,
      dueDate: data.dueDate,

      notes: data.notes?.trim() || undefined,
      notesAr: data.notesAr?.trim() || undefined,
    });

    await this.activityLogsService.log({
      adminId,
      action: 'created',
      entityType: 'project',
      entityId: project.id,
      entityLabel: `${project.projectNo} - ${project.title}`,
      entityLabelAr: project.titleAr
        ? `${project.projectNo} - ${project.titleAr}`
        : undefined,
      ipAddress,
    });

    return project;
  }

  // Update project
  async update(
    id: number,
    data: UpdateProjectDto,
    adminId: number,
    ipAddress?: string,
  ) {
    const project = await db.orm.public.Project.first({ id });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      data.quotationId !== undefined &&
      data.quotationId !== project.quotationId
    ) {
      const quotation = await db.orm.public.Quotation.first({
        id: data.quotationId,
      });

      if (!quotation) {
        throw new BadRequestException('Selected quotation does not exist');
      }

      if (quotation.status !== 'accepted') {
        throw new BadRequestException(
          'Only accepted quotations can be linked to projects',
        );
      }

      const existingProject = await db.orm.public.Project.first({
        quotationId: data.quotationId,
      });

      if (existingProject && existingProject.id !== id) {
        throw new BadRequestException(
          'A project already exists for this quotation',
        );
      }
    }

    const nextStatus = data.status ?? project.status;
    const statusChanged = nextStatus !== project.status;

    // Completed project always remains 100%
    const progress =
      nextStatus === 'completed'
        ? 100
        : (data.progress ?? project.progress);

    await db.orm.public.Project.where({ id }).update({
      quotationId: data.quotationId ?? project.quotationId,

      clientName:
        data.clientName !== undefined
          ? data.clientName.trim()
          : project.clientName,

      clientNameAr:
        data.clientNameAr !== undefined
          ? data.clientNameAr.trim()
          : project.clientNameAr,

      company:
        data.company !== undefined
          ? data.company.trim()
          : project.company,

      companyAr:
        data.companyAr !== undefined
          ? data.companyAr.trim()
          : project.companyAr,

      title:
        data.title !== undefined
          ? data.title.trim()
          : project.title,

      titleAr:
        data.titleAr !== undefined
          ? data.titleAr.trim()
          : project.titleAr,

      description:
        data.description !== undefined
          ? data.description.trim()
          : project.description,

      descriptionAr:
        data.descriptionAr !== undefined
          ? data.descriptionAr.trim()
          : project.descriptionAr,

      status: nextStatus,
      priority: data.priority ?? project.priority,
      progress,

      budget: data.budget ?? project.budget,

      currency:
        data.currency !== undefined
          ? data.currency.trim()
          : project.currency,

      startDate: data.startDate ?? project.startDate,
      dueDate: data.dueDate ?? project.dueDate,

      notes:
        data.notes !== undefined
          ? data.notes.trim()
          : project.notes,

      notesAr:
        data.notesAr !== undefined
          ? data.notesAr.trim()
          : project.notesAr,
    });

    const updated = await this.findOne(id);

    await this.activityLogsService.log({
      adminId,
      action: statusChanged ? 'status_changed' : 'updated',
      entityType: 'project',
      entityId: id,
      entityLabel: `${updated.projectNo} - ${updated.title}`,
      entityLabelAr: updated.titleAr
        ? `${updated.projectNo} - ${updated.titleAr}`
        : undefined,
      ipAddress,
    });

    return updated;
  }

  // Delete project
  async remove(
    id: number,
    adminId: number,
    ipAddress?: string,
  ) {
    const project = await db.orm.public.Project.first({ id });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await db.orm.public.Project.where({ id }).delete();

    await this.activityLogsService.log({
      adminId,
      action: 'deleted',
      entityType: 'project',
      entityId: id,
      entityLabel: `${project.projectNo} - ${project.title}`,
      entityLabelAr: project.titleAr
        ? `${project.projectNo} - ${project.titleAr}`
        : undefined,
      ipAddress,
    });

    return {
      message: 'Project deleted successfully',
    };
  }

  // Generate unique project number
  private async generateProjectNo() {
    const year = new Date().getFullYear();

    for (let attempt = 0; attempt < 10; attempt++) {
      const random = Math.floor(100000 + Math.random() * 900000);
      const projectNo = `PRJ-${year}-${random}`;

      const existing = await db.orm.public.Project.first({
        projectNo,
      });

      if (!existing) {
        return projectNo;
      }
    }

    throw new BadRequestException('Unable to generate project number');
  }
}