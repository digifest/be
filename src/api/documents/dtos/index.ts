import { IsEnum, IsNumber, IsString } from 'src/shared/decorators';
import { DocType, SortType } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @IsString(true)
  name: string;

  @IsString(true)
  course: string;

  @IsString(true)
  department: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @IsEnum(DocType, false)
  document_type: DocType;

  @IsString(true)
  description: string;
}

export class GetDocumentsQuery {
  @IsString(true)
  search?: string;

  @IsNumber(true)
  level?: number;

  @IsString(true)
  department?: string;

  @IsEnum(DocType, true)
  document_type: DocType;

  @IsNumber(true)
  semester_index?: number;

  @IsNumber(true)
  page?: number;

  @IsNumber(true)
  limit?: number;

  @IsEnum(SortType, true)
  sort?: SortType;
}
