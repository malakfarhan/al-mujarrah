import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  // English title is required
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  // Shared URL slug
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  excerptAr?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  contentAr?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  categoryAr?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaTitleAr?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaDescriptionAr?: string;
}