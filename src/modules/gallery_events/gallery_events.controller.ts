import { Body, Controller, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { GalleryEventsService } from './gallery_events.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../../commons/enum/roles.enum';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('GalleryEvents')
@Controller('gallery-events')
export class GalleryEventsController {
    constructor(private readonly galleryEventService: GalleryEventsService) {}

    @Post('gallery/enter_gallery/:personId')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'personId',
        format: 'uuid',
        type: 'string',
    })
    @ApiBearerAuth()
    async enterGallery(@Param('personId', ParseUUIDPipe) personId: string, @Req() req: any) {
        try {
            return await this.galleryEventService.enterGallery(personId, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('gallery/leave_gallery/:personId')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'personId',
        format: 'uuid',
        type: 'string',
    })
    @ApiBearerAuth()
    async leaveGallery(@Param('personId', ParseUUIDPipe) personId: string, @Req() req: any) {
        try {
            return await this.galleryEventService.leaveGallery(personId, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('gallery/enter_room/:roomId/:personId')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'roomId',
        format: 'uuid',
        type: 'string',
    })
    @ApiParam({
        name: 'personId',
        format: 'uuid',
        type: 'string',
    })
    @ApiBearerAuth()
    async enterRoom(
        @Param('roomId', ParseUUIDPipe) roomId: string,
        @Param('personId', ParseUUIDPipe) personId: string,
        @Req() req: any,
    ) {
        try {
            return await this.galleryEventService.enterRoom(personId, roomId, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('gallery/leave_room/:roomId/:personId')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'roomId',
        format: 'uuid',
        type: 'string',
    })
    @ApiParam({
        name: 'personId',
        format: 'uuid',
        type: 'string',
    })
    @ApiBearerAuth()
    async leaveRoom(
        @Param('roomId', ParseUUIDPipe) roomId: string,
        @Param('personId', ParseUUIDPipe) personId: string,
        @Req() req: any,
    ) {
        try {
            return await this.galleryEventService.leaveRoom(personId, roomId, req.userId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
