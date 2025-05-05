import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsProcessor } from './events.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [EventEmitterModule.forRoot({}), MailModule],
  providers: [EventsProcessor],
})
export class EventsModule {}
