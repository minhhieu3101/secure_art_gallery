import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConnect } from './configs/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { JwtModule } from '@nestjs/jwt';
import { MailSenderModule } from './modules/mail_sender/mail_sender.module';
import { AuditModule } from './modules/audit/audit.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { GalleryEventsModule } from './modules/gallery_events/gallery_events.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            useClass: databaseConnect,
        }),
        AuthModule,
        UsersModule,
        SessionsModule,
        JwtModule,
        MailSenderModule,
        AuditModule,
        RoomsModule,
        GalleryEventsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
