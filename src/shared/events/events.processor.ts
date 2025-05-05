import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from './enums';
import { SendMail } from '../mail/interfaces';
import { MailService } from '../mail/mail.service';

@Injectable()
export class EventsProcessor {
  private readonly _logger: Logger;

  constructor(private readonly mailService: MailService) {
    this._logger = new Logger(EventsProcessor.name);
  }

  @OnEvent(EventNames.EMAIL)
  async sendMail(dto: SendMail) {
    this._logger.log('Sending mail');

    await this.mailService.sendMail(dto);

    this._logger.log('mail sent successfully');
  }
}
