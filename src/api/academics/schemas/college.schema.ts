import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DbMixins } from 'src/shared/constants/db.const';
import { DBSchema } from 'src/shared/decorators';
import { v4 } from 'uuid';

@DBSchema()
export class College extends DbMixins {
  @Prop({ default: () => v4() })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  acronym: string;
}

export type CollegeDocument = HydratedDocument<College>;
export const CollegeSchema = SchemaFactory.createForClass(College);
