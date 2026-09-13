import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { QuotationsController } from './quotations.controller.js';
import { QuotationsService } from './quotations.service.js';
import { QuotationPdfService } from './quotation-pdf.service.js';

@Module({
  imports: [
    AuthModule,
    ActivityLogsModule,
  ],
  controllers: [QuotationsController],
  providers: [
    QuotationsService,
    QuotationPdfService,
  ],
})
export class QuotationsModule {}