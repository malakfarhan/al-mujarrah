import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UploadsService } from './uploads.service.js';

type UploadedFileData = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  // Admin-only portfolio image upload
  @Post('portfolio')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        // Maximum 5 MB
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (_req, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Only JPG, PNG and WEBP images are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadPortfolioImage(
    @UploadedFile() file: UploadedFileData,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Please select an image',
      );
    }

    return this.uploadsService.uploadPortfolioImage(
      file,
    );
  }
}