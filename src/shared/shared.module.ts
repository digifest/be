import { Module } from '@nestjs/common';
import { UtilService } from 'src/shared/services/utils.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from './file/file.service';
import { FileProvider } from './file/file.provider';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ConfigModule, MailModule, EventsModule],
  providers: [UtilService, FileProvider, FileService],
  exports: [MailModule, UtilService, FileService, EventsModule],
})
export class SharedModule {}
