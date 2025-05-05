import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/shared/shared.module';
import { Token, TokenSchema } from './schemas/token.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthSchema,
      },
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
    UserModule,
    SharedModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, MongooseModule],
})
export class AuthModule {}
