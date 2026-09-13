import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateAdminDto {
  // Update admin name
  @IsOptional()
  @IsString()
  name?: string;

  // Update admin email
  @IsOptional()
  @IsEmail()
  email?: string;

  // Change password only when provided
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  // Assign one or more roles
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  roleIds?: number[];

  // Activate or deactivate admin
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}