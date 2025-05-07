import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './schemas/document.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { FileService } from 'src/shared/file/file.service';
import { CreateDocumentDto, GetDocumentsQuery } from './dtos';
import * as mime from 'mime-types';
import * as path from 'path';
import { PaginationQuery } from 'src/shared/interfaces/pagination.interface';
import { UtilService } from 'src/shared/services/utils.service';
import { DocType, SortType } from './enums';
import { isEmpty } from 'lodash';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name)
    private readonly documentModel: Model<Document>,

    private readonly fileService: FileService,
    private readonly utilService: UtilService,
  ) {}

  async createDocument(body: CreateDocumentDto, user_id: string) {
    const { name, department, description, document_type, file, course } = body;

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
      course,
      department,
      url: secure_url,
      upload_id: public_id,
      uploaded_by: user_id,
      mime_type: file_type ?? file.mimetype,
      document_type,
      description,
      byte_size: file?.size,
    });

    return {
      success: true,
      message: 'Document created successfully',
      data,
    };
  }

  async getDocuments(query: GetDocumentsQuery) {
    const _query: FilterQuery<Document> = {};
    const paginationQuery: PaginationQuery = {};
    const sortQuery: { [key: string]: SortOrder } = {};

    if (query.department) {
      _query.department = query.department;
      delete query.department;
    }

    if (query.document_type) {
      _query.document_type = query.document_type;
      delete query.document_type;
    }

    if (query.level) {
      _query['course.level'] = query.level;
      delete query.level;
    }

    if (query.limit) {
      paginationQuery.limit = Number(query.limit);
      delete query.limit;
    }

    if (query.page) {
      paginationQuery.page = Number(query.page);
      delete query.page;
    }

    if (query.semester_index) {
      _query['course.semester_index'] = query.semester_index;
      delete query.semester_index;
    }

    if (query.search) {
      const regexSearch = { $regex: new RegExp(query.search, 'i') };
      _query.$or = [
        { name: regexSearch },
        { 'course.name': regexSearch },
        { 'course.course_code': regexSearch },
      ];
      delete query.search;
    }

    switch (query.sort) {
      case SortType.most_recent:
        sortQuery['createdAt'] = -1;
        break;
      case SortType.oldest_first:
        sortQuery['createdAt'] = 1;
        break;
      case SortType.a_z:
        sortQuery['name'] = 1;
        break;
      case SortType.z_a:
        sortQuery['name'] = -1;
        break;
      default:
        sortQuery['createdAt'] = -1;
        break;
    }

    const count = await this.documentModel.countDocuments(_query);

    const { totalPages, offset, limit, page } =
      this.utilService.getPaginationData(paginationQuery, count);

    const data = await this.documentModel.aggregate([
      {
        $lookup: {
          from: 'departments',
          as: 'department',
          localField: 'department',
          foreignField: '_id',
        },
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'courses',
          as: 'course',
          localField: 'course',
          foreignField: '_id',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: _query,
      },
      { $sort: sortQuery as any },
      ...(!isEmpty(paginationQuery)
        ? [{ $skip: offset }, { $limit: limit }]
        : []),
    ]);

    const metrics = await this.getDocumentsMetrics(_query);

    return {
      message: 'Documents fetched',
      success: true,
      data,
      meta: {
        totalPages,
        count,
        page: page,
        metrics,
      },
    };
  }

  async getDocumentsMetrics(query: FilterQuery<Document>) {
    const levels = [100, 200, 300, 400, 500, 600];
    const db_categories = await this.documentModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$document_type',
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          total: 1,
        },
      },
    ]);

    const db_document_by_levels = await this.documentModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$level',
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          level: '$_id',
          total: 1,
        },
      },
    ]);

    const document_by_levels = [];
    for (const level of levels) {
      const db_level = db_document_by_levels.find((r) => r.level == level);

      document_by_levels.push({
        level,
        total: db_level?.total ?? 0,
      });
    }

    const categories = [];

    for (const docType of Object.values(DocType)) {
      const type = db_categories.find((r) => r.category === docType);

      categories.push({
        category: docType,
        total: type?.total ?? 0,
      });
    }

    return { document_by_levels, categories };
  }
}
