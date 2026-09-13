import { IsIn, IsString } from 'class-validator';

export class UpdateLeadStatusDto {
  // Allowed lead statuses
  @IsString()
  @IsIn([
    'new',
    'contacted',
    'qualified',
    'won',
    'lost',
  ])
  status: string;
}