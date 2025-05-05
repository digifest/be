import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/api/user/schemas/user.schema';
import { DBSchema } from 'src/shared/decorators';
import { v4 } from 'uuid';

@DBSchema()
export class Auth {
  @Prop({ default: () => v4() })
  _id: string;

  @Prop({ type: String, ref: User.name })
  user: User;

  @Prop()
  password: string;

  @Prop()
  password_history: string[];

  @Prop()
  access_token: string;

  @Prop()
  access_token_expires: Date;
}

export type AuthDocument = HydratedDocument<Auth>;
export const AuthSchema = SchemaFactory.createForClass(Auth);
