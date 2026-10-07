import { Module } from '@nestjs/common';
import { GalleryEventsController } from './gallery_events.controller';
import { GalleryEventsService } from './gallery_events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryEvent } from './gallery_events.entity';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { GalleryEventRepository } from './gallery_events.repository';
import { jwtModule } from '../jwts/jwts.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports:[TypeOrmModule.forFeature([GalleryEvent]), RoomsModule, UsersModule, jwtModule, SessionsModule, AuditModule],
  controllers: [GalleryEventsController],
  providers: [GalleryEventsService, GalleryEventRepository],
  exports:[GalleryEventsService, GalleryEventRepository]
})
export class GalleryEventsModule {}
