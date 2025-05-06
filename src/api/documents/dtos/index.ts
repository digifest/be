import { IsEnum, IsNumber, IsString } from 'src/shared/decorators';
import { DocType } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @IsString(true)
  name: string;

  @IsNumber(false)
  level: number;

  @IsString(true)
  department: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @IsEnum(DocType, false)
  document_type: DocType;

  @IsNumber(false)
  semester_index: number;

  @IsString(true)
  description: string;
}
