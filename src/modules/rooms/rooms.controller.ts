import { Body, Controller, Get, Param, Post, UseGuards, Req, Patch } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { ChangeRoomStatusDTO, CreateRoomDto } from './dto/createRoom.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../../commons/enum/roles.enum';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';

@Controller('')
export class RoomsController {
    constructor(private readonly roomService: RoomService) {}

    @Post('room/createRoom')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async createRoom(@Body() room: CreateRoomDto, @Req() req: any): Promise<any> {
        try {
            return await this.roomService.createRoom(room.number, room.occupancy, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Patch('room/changeStatus')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async changeRoomStatus(@Body() input: ChangeRoomStatusDTO, @Req() req: any): Promise<any> {
        try {
            return await this.roomService.changeRoomStatus(input.number, input.status, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Get('room/:id')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'roomId',
        format: 'uuid',
        type: 'string',
    })
    @ApiBearerAuth()
    async getRoom(@Param() id: string): Promise<any> {
        try {
            return await this.roomService.getRoom(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Get('dashboard/room')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async getAllRoom(): Promise<any> {
        try {
            return await this.roomService.getAllRoom();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Get('dashboard/opened_room')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async getAllOpenedRoom(): Promise<any> {
        try {
            return await this.roomService.getAllOpenedRoom();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
