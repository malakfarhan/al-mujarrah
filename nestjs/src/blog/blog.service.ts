import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';

@Injectable()
export class BlogService {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  // Admin: get all blog posts
  async findAll() {
    return db.orm.public.Blog.all();
  }

  // Admin: get one blog post
  async findOne(id: number) {
    const blog = await db.orm.public.Blog.first({ id });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  // Public: published posts only
  async findPublished() {
    const blogs = await db.orm.public.Blog
      .where({ isPublished: true })
      .all();

    return blogs.sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime(),
    );
  }

  // Public: get published post by slug
  async findBySlug(slug: string) {
    const cleanSlug = this.cleanSlug(slug);

    const blog = await db.orm.public.Blog.first({
      slug: cleanSlug,
    });

    if (!blog || !blog.isPublished) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  // Create blog post
  async create(
    data: CreateBlogDto,
    adminId: number,
    ipAddress?: string,
  ) {
    const title = data.title.trim();
    const slug = this.cleanSlug(data.slug);

    if (!title) {
      throw new BadRequestException('Blog title is required');
    }

    if (!slug) {
      throw new BadRequestException('Blog slug is required');
    }

    const existing = await db.orm.public.Blog.first({ slug });

    if (existing) {
      throw new BadRequestException('Blog slug already exists');
    }

    const isPublished = data.isPublished ?? false;

    const blog = await db.orm.public.Blog.create({
      title,
      titleAr: this.optionalText(data.titleAr),
      slug,

      excerpt: this.optionalText(data.excerpt),
      excerptAr: this.optionalText(data.excerptAr),

      content: this.optionalText(data.content),
      contentAr: this.optionalText(data.contentAr),

      category: this.optionalText(data.category),
      categoryAr: this.optionalText(data.categoryAr),

      coverImage: this.optionalText(data.coverImage),

      isFeatured: data.isFeatured ?? false,
      isPublished,

      metaTitle: this.optionalText(data.metaTitle),
      metaTitleAr: this.optionalText(data.metaTitleAr),

      metaDescription: this.optionalText(data.metaDescription),
      metaDescriptionAr: this.optionalText(data.metaDescriptionAr),

      publishedAt: isPublished ? new Date().toISOString() : undefined,
    });

    // Record blog creation/publish activity
    await this.activityLogsService.log({
      adminId,
      action: isPublished ? 'published' : 'created',
      entityType: 'blog',
      entityId: blog.id,
      entityLabel: blog.title,
      entityLabelAr: blog.titleAr || undefined,
      ipAddress,
    });

    return blog;
  }

  // Update blog post
  async update(
    id: number,
    data: UpdateBlogDto,
    adminId: number,
    ipAddress?: string,
  ) {
    const blog = await db.orm.public.Blog.first({ id });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    let title = blog.title;
    let slug = blog.slug;

    if (data.title !== undefined) {
      title = data.title.trim();

      if (!title) {
        throw new BadRequestException('Blog title is required');
      }
    }

    if (data.slug !== undefined) {
      slug = this.cleanSlug(data.slug);

      if (!slug) {
        throw new BadRequestException('Blog slug is required');
      }

      const existing = await db.orm.public.Blog.first({ slug });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Blog slug already exists');
      }
    }

    const isPublished = data.isPublished ?? blog.isPublished;
    const publishChanged = isPublished !== blog.isPublished;

    let publishedAt = blog.publishedAt;

    // Set publish date when published first time
    if (isPublished && !blog.isPublished) {
      publishedAt = new Date().toISOString();
    }

    if (!isPublished) {
      publishedAt = null;
    }

    await db.orm.public.Blog.where({ id }).update({
      title,
      titleAr: this.updateText(data.titleAr, blog.titleAr),
      slug,

      excerpt: this.updateText(data.excerpt, blog.excerpt),
      excerptAr: this.updateText(data.excerptAr, blog.excerptAr),

      content: this.updateText(data.content, blog.content),
      contentAr: this.updateText(data.contentAr, blog.contentAr),

      category: this.updateText(data.category, blog.category),
      categoryAr: this.updateText(data.categoryAr, blog.categoryAr),

      coverImage: this.updateText(data.coverImage, blog.coverImage),

      isFeatured: data.isFeatured ?? blog.isFeatured,
      isPublished,

      metaTitle: this.updateText(data.metaTitle, blog.metaTitle),
      metaTitleAr: this.updateText(data.metaTitleAr, blog.metaTitleAr),

      metaDescription: this.updateText(
        data.metaDescription,
        blog.metaDescription,
      ),
      metaDescriptionAr: this.updateText(
        data.metaDescriptionAr,
        blog.metaDescriptionAr,
      ),

      publishedAt,
    });

    const updated = await this.findOne(id);

    let action = 'updated';

    if (publishChanged) {
      action = isPublished ? 'published' : 'unpublished';
    }

    await this.activityLogsService.log({
      adminId,
      action,
      entityType: 'blog',
      entityId: id,
      entityLabel: updated.title,
      entityLabelAr: updated.titleAr || undefined,
      ipAddress,
    });

    return updated;
  }

  // Delete blog post
  async remove(
    id: number,
    adminId: number,
    ipAddress?: string,
  ) {
    const blog = await db.orm.public.Blog.first({ id });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    await db.orm.public.Blog.where({ id }).delete();

    await this.activityLogsService.log({
      adminId,
      action: 'deleted',
      entityType: 'blog',
      entityId: id,
      entityLabel: blog.title,
      entityLabelAr: blog.titleAr || undefined,
      ipAddress,
    });

    return {
      message: 'Blog post deleted successfully',
    };
  }

  // Trim optional text during create
  private optionalText(value?: string) {
    return value?.trim() || undefined;
  }

  // Empty string clears optional fields during update
  private updateText(
    value: string | undefined,
    current: string | null | undefined,
  ) {
    if (value === undefined) {
      return current;
    }

    return value.trim() || null;
  }

  // Shared English URL slug
  private cleanSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}