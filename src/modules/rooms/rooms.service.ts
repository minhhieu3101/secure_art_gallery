import { Injectable } from '@nestjs/common';
import { RoomRepository } from './rooms.repository';
import { RoomStatus } from '../../commons/enum/room.status';

@Injectable()
export class RoomService {
    constructor(private readonly roomRepository: RoomRepository){}

    async createRoom(number: number, occupancy: number){
        return await this.roomRepository.save({
            number: number,
            occupancy: occupancy
        })
    }

    async getRoom(id: string) {
        return await this.roomRepository.getById(id);
    }

    async getRoomByNumber(number: number){
        return await this.roomRepository.getByCondition({
            where: {
                number: number,
                status: RoomStatus.open
            }
        })
    }

    async getAllRoom(){
        return await this.roomRepository.getAll()
    }

    async getAllOpenedRoom(){
        return await this.roomRepository.getAllByCondition({
            where:{
                status: RoomStatus.open
            }
        })
    }
}
