import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { College } from 'src/api/academics/schemas/college.schema';
import { Department } from 'src/api/academics/schemas/department.schema';
import { DBSchema } from 'src/shared/decorators';
import { v4 } from 'uuid';
import { RoleNames } from '../enums';

@DBSchema()
export class User {
  @Prop({ default: () => v4() })
  _id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: String, ref: Department.name })
  department: string;

  @Prop({ type: String, ref: College.name })
  college: string;

  @Prop({ type: String, enum: Object.values(RoleNames) })
  role: RoleNames;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
