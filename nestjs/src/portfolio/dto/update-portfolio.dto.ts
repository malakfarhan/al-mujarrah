import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreatePortfolioImageDto } from './create-portfolio.dto.js';

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  shortDescriptionAr?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  contentAr?: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsString()
  clientAr?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  industryAr?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  serviceAr?: string;

  @IsOptional()
  @IsString()
  technologies?: string;

  @IsOptional()
  @IsString()
  technologiesAr?: string;

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
  @IsInt()
  @Min(0)
  sortOrder?: number;

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

  // If provided, replace the current gallery
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioImageDto)
  images?: CreatePortfolioImageDto[];
}