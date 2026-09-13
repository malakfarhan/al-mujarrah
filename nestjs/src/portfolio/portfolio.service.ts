import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';
import {
  CreatePortfolioDto,
  CreatePortfolioImageDto,
} from './dto/create-portfolio.dto.js';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto.js';

@Injectable()
export class PortfolioService {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  // Admin: get all portfolio items
  async findAll() {
    return db.orm.public.Portfolio.all();
  }

  // Admin: get one portfolio item with gallery
  async findOne(id: number) {
    const portfolio = await db.orm.public.Portfolio.first({ id });

    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }

    const images = await db.orm.public.PortfolioImage
      .where({ portfolioId: id })
      .all();

    return {
      ...portfolio,
      images: images.sort((a, b) => a.sortOrder - b.sortOrder),
    };
  }

  // Public: get published portfolio item by slug
  async findBySlug(slug: string) {
    const cleanSlug = this.cleanSlug(slug);

    const portfolio = await db.orm.public.Portfolio.first({
      slug: cleanSlug,
    });

    if (!portfolio || !portfolio.isPublished) {
      throw new NotFoundException('Portfolio item not found');
    }

    const images = await db.orm.public.PortfolioImage
      .where({ portfolioId: portfolio.id })
      .all();

    return {
      ...portfolio,
      images: images.sort((a, b) => a.sortOrder - b.sortOrder),
    };
  }

  // Public: only published portfolio items
  async findPublished() {
    const items = await db.orm.public.Portfolio
      .where({ isPublished: true })
      .all();

    return items.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }

  // Create portfolio item
  async create(
    data: CreatePortfolioDto,
    adminId: number,
    ipAddress?: string,
  ) {
    const title = data.title.trim();
    const slug = this.cleanSlug(data.slug);

    if (!title) {
      throw new BadRequestException('Portfolio title is required');
    }

    if (!slug) {
      throw new BadRequestException('Portfolio slug is required');
    }

    const existing = await db.orm.public.Portfolio.first({ slug });

    if (existing) {
      throw new BadRequestException('Portfolio slug already exists');
    }

    const isPublished = data.isPublished ?? false;

    const portfolio = await db.orm.public.Portfolio.create({
      title,
      titleAr: this.optionalText(data.titleAr),
      slug,

      shortDescription: this.optionalText(data.shortDescription),
      shortDescriptionAr: this.optionalText(data.shortDescriptionAr),

      content: this.optionalText(data.content),
      contentAr: this.optionalText(data.contentAr),

      client: this.optionalText(data.client),
      clientAr: this.optionalText(data.clientAr),

      industry: this.optionalText(data.industry),
      industryAr: this.optionalText(data.industryAr),

      service: this.optionalText(data.service),
      serviceAr: this.optionalText(data.serviceAr),

      technologies: this.optionalText(data.technologies),
      technologiesAr: this.optionalText(data.technologiesAr),

      coverImage: this.optionalText(data.coverImage),

      isFeatured: data.isFeatured ?? false,
      isPublished,
      sortOrder: data.sortOrder ?? 0,

      metaTitle: this.optionalText(data.metaTitle),
      metaTitleAr: this.optionalText(data.metaTitleAr),

      metaDescription: this.optionalText(data.metaDescription),
      metaDescriptionAr: this.optionalText(data.metaDescriptionAr),

      publishedAt: isPublished
        ? new Date().toISOString()
        : undefined,
    });

    if (data.images?.length) {
      await this.createImages(portfolio.id, data.images);
    }

    await this.activityLogsService.log({
      adminId,
      action: isPublished ? 'published' : 'created',
      entityType: 'portfolio',
      entityId: portfolio.id,
      entityLabel: portfolio.title,
      entityLabelAr: portfolio.titleAr || undefined,
      ipAddress,
    });

    return this.findOne(portfolio.id);
  }

  // Update portfolio item
  async update(
    id: number,
    data: UpdatePortfolioDto,
    adminId: number,
    ipAddress?: string,
  ) {
    const portfolio = await db.orm.public.Portfolio.first({ id });

    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }

    let slug = portfolio.slug;

    if (data.slug !== undefined) {
      slug = this.cleanSlug(data.slug);

      if (!slug) {
        throw new BadRequestException('Portfolio slug is required');
      }

      const existing = await db.orm.public.Portfolio.first({ slug });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Portfolio slug already exists');
      }
    }

    let title = portfolio.title;

    if (data.title !== undefined) {
      title = data.title.trim();

      if (!title) {
        throw new BadRequestException('Portfolio title is required');
      }
    }

    const isPublished =
      data.isPublished ?? portfolio.isPublished;

    const publishChanged =
      isPublished !== portfolio.isPublished;

    let publishedAt = portfolio.publishedAt;

    if (isPublished && !portfolio.isPublished) {
      publishedAt = new Date().toISOString();
    }

    if (!isPublished) {
      publishedAt = null;
    }

    await db.orm.public.Portfolio.where({ id }).update({
      title,
      titleAr: this.updateText(data.titleAr, portfolio.titleAr),
      slug,

      shortDescription: this.updateText(
        data.shortDescription,
        portfolio.shortDescription,
      ),
      shortDescriptionAr: this.updateText(
        data.shortDescriptionAr,
        portfolio.shortDescriptionAr,
      ),

      content: this.updateText(data.content, portfolio.content),
      contentAr: this.updateText(data.contentAr, portfolio.contentAr),

      client: this.updateText(data.client, portfolio.client),
      clientAr: this.updateText(data.clientAr, portfolio.clientAr),

      industry: this.updateText(data.industry, portfolio.industry),
      industryAr: this.updateText(
        data.industryAr,
        portfolio.industryAr,
      ),

      service: this.updateText(data.service, portfolio.service),
      serviceAr: this.updateText(data.serviceAr, portfolio.serviceAr),

      technologies: this.updateText(
        data.technologies,
        portfolio.technologies,
      ),
      technologiesAr: this.updateText(
        data.technologiesAr,
        portfolio.technologiesAr,
      ),

      coverImage: this.updateText(
        data.coverImage,
        portfolio.coverImage,
      ),

      isFeatured: data.isFeatured ?? portfolio.isFeatured,
      isPublished,
      sortOrder: data.sortOrder ?? portfolio.sortOrder,

      metaTitle: this.updateText(data.metaTitle, portfolio.metaTitle),
      metaTitleAr: this.updateText(
        data.metaTitleAr,
        portfolio.metaTitleAr,
      ),

      metaDescription: this.updateText(
        data.metaDescription,
        portfolio.metaDescription,
      ),
      metaDescriptionAr: this.updateText(
        data.metaDescriptionAr,
        portfolio.metaDescriptionAr,
      ),

      publishedAt,
    });

    // Replace gallery only when images are supplied
    if (data.images !== undefined) {
      await this.deleteImages(id);

      if (data.images.length) {
        await this.createImages(id, data.images);
      }
    }

    const updated = await this.findOne(id);

    let action = 'updated';

    if (publishChanged) {
      action = isPublished ? 'published' : 'unpublished';
    }

    await this.activityLogsService.log({
      adminId,
      action,
      entityType: 'portfolio',
      entityId: id,
      entityLabel: updated.title,
      entityLabelAr: updated.titleAr || undefined,
      ipAddress,
    });

    return updated;
  }

  // Delete portfolio item
  async remove(
    id: number,
    adminId: number,
    ipAddress?: string,
  ) {
    const portfolio = await db.orm.public.Portfolio.first({ id });

    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }

    await this.deleteImages(id);

    await db.orm.public.Portfolio.where({ id }).delete();

    await this.activityLogsService.log({
      adminId,
      action: 'deleted',
      entityType: 'portfolio',
      entityId: id,
      entityLabel: portfolio.title,
      entityLabelAr: portfolio.titleAr || undefined,
      ipAddress,
    });

    return {
      message: 'Portfolio item deleted successfully',
    };
  }

  // Create gallery images
  private async createImages(
    portfolioId: number,
    images: CreatePortfolioImageDto[],
  ) {
    for (const image of images) {
      const imageUrl = image.imageUrl.trim();

      if (!imageUrl) {
        continue;
      }

      await db.orm.public.PortfolioImage.create({
        portfolioId,
        imageUrl,
        caption: this.optionalText(image.caption),
        captionAr: this.optionalText(image.captionAr),
        sortOrder: image.sortOrder ?? 0,
      });
    }
  }

  // Composer delete may only remove one matching row
  private async deleteImages(portfolioId: number) {
    const images = await db.orm.public.PortfolioImage
      .where({ portfolioId })
      .all();

    for (const image of images) {
      await db.orm.public.PortfolioImage
        .where({ id: image.id })
        .delete();
    }
  }

  // Trim optional text during create
  private optionalText(value?: string) {
    return value?.trim() || undefined;
  }

  // Empty string intentionally clears optional fields during update
  private updateText(
    value: string | undefined,
    current: string | null | undefined,
  ) {
    if (value === undefined) {
      return current;
    }

    return value.trim() || null;
  }

  // Shared language-independent URL slug
  private cleanSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}