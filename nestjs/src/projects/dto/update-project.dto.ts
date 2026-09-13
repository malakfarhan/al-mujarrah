import {
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsInt()
  quotationId?: number;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  clientNameAr?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  companyAr?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsIn(['planning', 'active', 'on_hold', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  notesAr?: string;
}