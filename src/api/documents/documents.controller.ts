import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Auth, Roles } from 'src/shared/decorators/auth.decorators';
import { CreateDocumentDto } from './dtos';
import { DocumentService } from './documents.service';
import { RoleNames } from '../user/enums';

@Controller('documents')
@ApiTags('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  // @Roles([RoleNames.Admin])
  async createDocument(
    @Auth('_id') userId: string,
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.documentService.createDocument({ ...body, file }, userId);
  }
}
