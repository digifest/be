import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DBSchema } from 'src/shared/decorators';
import { v4 } from 'uuid';
import { Department } from './department.schema';
import { HydratedDocument } from 'mongoose';

@DBSchema()
export class Course {
  @Prop({ default: () => v4() })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  course_code: string;

  @Prop({ type: String, ref: Department.name })
  department: Department;

  @Prop()
  semester_index: number;

  @Prop()
  level: number;
}

export type CourseDocument = HydratedDocument<Course>;
export const CourseSchema = SchemaFactory.createForClass(Course);
