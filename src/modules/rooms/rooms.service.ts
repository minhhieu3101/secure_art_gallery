import { HttpException, Injectable } from '@nestjs/common';
import { RoomRepository } from './rooms.repository';
import { RoomStatus } from '../../commons/enum/room.status';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly auditService: AuditService,
    ) {}

    async createRoom(number: number, occupancy: number, admin_id: string) {
        try {
            const room = await this.roomRepository.save({
                number: number,
                occupancy: occupancy,
            });
            await this.auditService.appendLog(admin_id, `Admin ${admin_id} created Room ${room.number}`)
        } catch (error) {
            throw error
        }
    }

    async changeRoomStatus(number: number, room_status: RoomStatus, admin_id: string){
        const room = await this.roomRepository.getByCondition({
            where: {
                number: number
            }
        })
        if (!room){
            throw new HttpException(`Can not find this Room ${number}`, 400)
        }
        if (room.status === room_status){
            throw new HttpException(`This room is already ${room.status}`, 400)
        }
        room.status = room_status
        await this.roomRepository.save(room)
        await this.auditService.appendLog(admin_id, `Admin changed Room ${room.number} status to ${room.status}`)
    }

    async getRoom(id: string) {
        return await this.roomRepository.getById(id);
    }

    async getRoomByNumber(number: number) {
        return await this.roomRepository.getByCondition({
            where: {
                number: number,
                status: RoomStatus.open,
            },
        });
    }

    async getAllRoom() {
        return await this.roomRepository.getAll();
    }

    async getAllOpenedRoom() {
        return await this.roomRepository.getAllByCondition({
            where: {
                status: RoomStatus.open,
            },
        });
    }
}
