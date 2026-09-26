import { ConfigModule } from '@nestjs/config';
import { MailSenderService } from './mail_sender.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule],
    providers: [MailSenderService],
    controllers: [],
    exports: [MailSenderService],
})
export class MailSenderModule {}