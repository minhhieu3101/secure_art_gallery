import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../../commons/enum/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService: RoomService){}

    @Post('createRoom')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async createRoom(@Body() room: CreateRoomDto): Promise<any> {
        return await this.roomService.createRoom(Number(room.number));
    }
}
