import { Module } from '@nestjs/common';
import { GalleryEventsController } from './gallery_events.controller';
import { GalleryEventsService } from './gallery_events.service';

@Module({
  controllers: [GalleryEventsController],
  providers: [GalleryEventsService]
})
export class GalleryEventsModule {}
