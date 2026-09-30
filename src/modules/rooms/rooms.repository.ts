import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';
import { Room } from './rooms.entity';

@Injectable()
export class RoomRepository extends RepositoryUtils<Room> {
    constructor(@InjectRepository(Room) private RoomRepository: Repository<Room>) {
        super(RoomRepository);
    }
}