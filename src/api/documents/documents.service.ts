import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './schemas/document.schema';
import { Model } from 'mongoose';
import { FileService } from 'src/shared/file/file.service';
import { CreateDocumentDto } from './dtos';
import * as mime from 'mime-types';
import * as path from 'path';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name)
    private readonly documentModel: Model<Document>,

    private readonly fileService: FileService,
  ) {}

  async createDocument(body: CreateDocumentDto, user_id: string) {
    const {
      name,
      department,
      description,
      level,
      document_type,
      file,
      semester_index,
    } = body;

    const { secure_url, public_id } = await this.fileService.uploadBuffer(
      file.buffer,
      {
        resource_type: 'raw',
        format: path.extname(file.originalname),
      },
    );

    const file_type = mime.contentType(file.originalname);

    const data = await this.documentModel.create({
      name: name ?? file.originalname,
      level,
      department,
      url: secure_url,
      upload_id: public_id,
      uploaded_by: user_id,
      mime_type: file_type ?? file.mimetype,
      document_type,
      semester_index,
      description,
    });

    return {
      success: true,
      message: 'Document created successfully',
      data,
    };
  }

  async getDocuments() {}
}
