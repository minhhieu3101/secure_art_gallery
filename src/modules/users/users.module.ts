import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { MailSenderModule } from '../mail_sender/mail_sender.module';
import { UserRepository } from './users.repository';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtModule } from '../jwts/jwts.module';
import { AuditModule } from '../audit/audit.module';
import { ConfigModule } from '@nestjs/config';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), MailSenderModule, jwtModule, AuditModule, ConfigModule, SessionsModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService, UserRepository],
})
export class UsersModule {}
