import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';
import { GalleryEvent } from './gallery_events.entity';

@Injectable()
export class GalleryEventRepository extends RepositoryUtils<GalleryEvent> {
    constructor(@InjectRepository(GalleryEvent) private GalleryEventRepository: Repository<GalleryEvent>) {
        super(GalleryEventRepository);
    }
}