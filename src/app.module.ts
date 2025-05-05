import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('DATABASE_URL'),
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    ApiModule,
  ],
})
export class AppModule {}
