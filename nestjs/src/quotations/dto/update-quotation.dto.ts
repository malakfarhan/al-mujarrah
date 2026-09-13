import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateQuotationItemDto {
  // English item/service description
  @IsString()
  description: string;

  // Arabic item/service description
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  // Quantity must be positive
  @IsNumber()
  @Min(0.01)
  quantity: number;

  // Price per unit
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class UpdateQuotationDto {
  @IsOptional()
  @IsInt()
  leadId?: number;

  // Customer name English
  @IsOptional()
  @IsString()
  customerName?: string;

  // Customer name Arabic
  @IsOptional()
  @IsString()
  customerNameAr?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  // Company English
  @IsOptional()
  @IsString()
  company?: string;

  // Company Arabic
  @IsOptional()
  @IsString()
  companyAr?: string;

  // Quotation title English
  @IsOptional()
  @IsString()
  title?: string;

  // Quotation title Arabic
  @IsOptional()
  @IsString()
  titleAr?: string;

  // Description English
  @IsOptional()
  @IsString()
  description?: string;

  // Description Arabic
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  // Discount percentage: 0 - 100
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountRate?: number;

  // VAT percentage
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @IsOptional()
  @IsISO8601()
  validUntil?: string;

  // Notes English
  @IsOptional()
  @IsString()
  notes?: string;

  // Notes Arabic
  @IsOptional()
  @IsString()
  notesAr?: string;

  // Quotation workflow status
  @IsOptional()
  @IsString()
  @IsIn([
    'draft',
    'sent',
    'accepted',
    'rejected',
    'expired',
  ])
  status?: string;

  // If items are provided, backend recalculates totals
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateQuotationItemDto)
  items?: UpdateQuotationItemDto[];
}