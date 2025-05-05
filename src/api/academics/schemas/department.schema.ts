import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DbMixins } from 'src/shared/constants/db.const';
import { DBSchema } from 'src/shared/decorators';
import { College, CollegeDocument } from './college.schema';
import { v4 } from 'uuid';

@DBSchema()
export class Department extends DbMixins {
  @Prop({ default: () => v4() })
  _id: string;

  @Prop({ type: String, ref: College.name })
  college: CollegeDocument;

  @Prop()
  name: string;

  @Prop()
  acronym: string;

  @Prop()
  level_count: number;
}

export type DepartmentDocument = HydratedDocument<Department>;
export const DepartmentSchema = SchemaFactory.createForClass(Department);
