import 'dotenv/config';

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import path from 'path';

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class UploadsService {
  private readonly supabase;

  constructor() {
    const supabaseUrl =
      process.env['SUPABASE_URL'];

    const supabaseSecretKey =
      process.env['SUPABASE_SECRET_KEY'];

    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error(
        'Supabase Storage environment variables are missing',
      );
    }

    // Backend-only Supabase client
    this.supabase = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  async uploadPortfolioImage(
    file: UploadedImageFile,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Image file is required',
      );
    }

    const extension =
      path.extname(file.originalname).toLowerCase() ||
      '.jpg';

    const fileName =
      `${Date.now()}-${randomUUID()}${extension}`;

    // File path inside portfolio bucket
    const storagePath =
      `uploads/${fileName}`;

    const { error } =
      await this.supabase.storage
        .from('portfolio')
        .upload(
          storagePath,
          file.buffer,
          {
            contentType: file.mimetype,
            upsert: false,
          },
        );

    if (error) {
      throw new BadRequestException(
        `Image upload failed: ${error.message}`,
      );
    }

    // Bucket is public, so generate public URL
    const { data } =
      this.supabase.storage
        .from('portfolio')
        .getPublicUrl(storagePath);

    return {
      path: storagePath,
      url: data.publicUrl,
    };
  }
}