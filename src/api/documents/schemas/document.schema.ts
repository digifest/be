import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DbMixins } from 'src/shared/constants/db.const';
import { DBSchema } from 'src/shared/decorators';
import { v4 } from 'uuid';
import { DocType } from '../enums';
import { Department } from 'src/api/academics/schemas/department.schema';
import { User } from 'src/api/user/schemas/user.schema';

@DBSchema()
export class Document extends DbMixins {
  @Prop({ default: () => v4() })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  level: number;

  @Prop({ type: String, ref: Department.name })
  department: string;

  @Prop()
  url: string;

  @Prop()
  upload_id: string;

  @Prop()
  mime_type: string;

  @Prop()
  byte_size: number;

  @Prop({
    type: String,
    enum: Object.values(DocType),
    required: true,
  })
  document_type: DocType;

  @Prop({ type: String, ref: User.name })
  uploaded_by: User;

  @Prop()
  description: string;

  @Prop({ enum: [1, 2], type: Number })
  semester_index: number;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
