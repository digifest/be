import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DBSchema } from 'src/shared/decorators';
import { v4 } from 'uuid';
import { TokenType } from '../enums';
import { User } from 'src/api/user/schemas/user.schema';

@DBSchema()
export class Token {
  @Prop({ default: () => v4() })
  _id: string;

  @Prop()
  key: string;

  @Prop()
  value: string;

  @Prop({ type: String, ref: User.name })
  user: User | string;

  @Prop({
    type: String,
    enum: Object.values(TokenType),
    required: true,
  })
  token_type: TokenType;

  @Prop()
  expires_at: Date;
}

export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);
