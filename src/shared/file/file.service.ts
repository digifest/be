import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v2, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FileService {
  constructor(@Inject('Uploader') private readonly cloudinary: typeof v2) {}

  async uploadResource(
    file: string,
    options: UploadApiOptions = {},
  ): Promise<Pick<UploadApiResponse, 'secure_url' | 'public_id'>> {
    try {
      const data = await this.cloudinary.uploader.upload(file, {
        ...options,
        folder: 'pendulum',
      });

      return { secure_url: data.secure_url, public_id: data.public_id };
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(
        `Unable to upload resource to cloud ${error.message ?? error}`,
      );
    }
  }

  async uploadBuffer(
    buffer: Buffer,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { ...options },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  async deleteResource(
    public_id: string,
    options: UploadApiOptions = {},
  ): Promise<void> {
    try {
      await this.cloudinary.uploader.destroy(public_id, { ...options });
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(
        `Unable to delete resource from cloud ${error.message ?? error}`,
      );
    }
  }
}
