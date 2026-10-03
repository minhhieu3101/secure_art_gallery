import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { ConfigModule } from '@nestjs/config';
import { SessionRepository } from './sessions.repository';
import { Session } from './sessions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), ConfigModule],
  controllers: [SessionsController],
  providers: [SessionsService, SessionRepository],
  exports: [SessionsService]
})
export class SessionsModule {}
