import { Test, TestingModule } from '@nestjs/testing';
import { GalleryEventsService } from './gallery_events.service';

describe('GalleryEventsService', () => {
  let service: GalleryEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalleryEventsService],
    }).compile();

    service = module.get<GalleryEventsService>(GalleryEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
