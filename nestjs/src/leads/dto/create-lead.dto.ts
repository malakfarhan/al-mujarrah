import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  message?: string;
}