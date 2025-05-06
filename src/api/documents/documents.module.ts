import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from './schemas/document.schema';
import { DocumentsController } from './documents.controller';
import { DocumentService } from './documents.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Document.name,
        schema: DocumentSchema,
      },
    ]),
    SharedModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
