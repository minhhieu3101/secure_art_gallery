import { Body, Controller, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { GalleryEventsService } from './gallery_events.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../../commons/enum/roles.enum';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { EventGalleryDto, EventRoomDto } from './dto/createEvents.dto';

@ApiTags('GalleryEvents')
@Controller('')
export class GalleryEventsController {
    constructor(private readonly galleryEventService: GalleryEventsService) {}

    @Post('events/gallery/enter')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async enterGallery(@Body() event: EventGalleryDto, @Req() req: any) {
        try {
            return await this.galleryEventService.enterGallery(event.email, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('events/gallery/leave')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async leaveGallery(@Body() event: EventGalleryDto, @Req() req: any) {
        try {
            return await this.galleryEventService.leaveGallery(event.email, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('events/room/enter')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async enterRoom(@Body() event: EventRoomDto, @Req() req: any) {
        try {
            return await this.galleryEventService.enterRoom(event.email, event.room_number, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('events/room/leave')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async leaveRoom(@Body() event: EventRoomDto, @Req() req: any) {
        try {
            return await this.galleryEventService.leaveRoom(event.email, event.room_number, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
