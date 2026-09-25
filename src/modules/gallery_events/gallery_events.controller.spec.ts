import { Test, TestingModule } from '@nestjs/testing';
import { GalleryEventsController } from './gallery_events.controller';

describe('GalleryEventsController', () => {
  let controller: GalleryEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryEventsController],
    }).compile();

    controller = module.get<GalleryEventsController>(GalleryEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
