import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuotationItemDto {
  // English item/service description
  @IsString()
  @IsNotEmpty()
  description: string;

  // Arabic item/service description
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  // Quantity must be greater than 0
  @IsNumber()
  @Min(0.01)
  quantity: number;

  // Price for one unit
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CreateQuotationDto {
  // Optional source lead
  @IsOptional()
  @IsInt()
  leadId?: number;

  // Customer name English
  @IsString()
  @IsNotEmpty()
  customerName: string;

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
  @IsString()
  @IsNotEmpty()
  title: string;

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

  // Default SAR if not provided
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

  // At least one quotation item is required
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[];
}