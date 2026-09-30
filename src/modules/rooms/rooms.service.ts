import { Injectable } from '@nestjs/common';
import { RoomRepository } from './rooms.repository';

@Injectable()
export class RoomService {
    constructor(private readonly roomRepository: RoomRepository){}

    async createRoom(number: number){
        return await this.roomRepository.save({
            number: number
        })
    }

    async getRoom(id: string) {
        return await this.roomRepository.getById(id);
    }
}
