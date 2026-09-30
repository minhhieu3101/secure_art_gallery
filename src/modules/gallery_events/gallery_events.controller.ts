import { Body, Controller, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { GalleryEventsService } from './gallery_events.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../../commons/enum/roles.enum';
import { createEventDto } from './dto/createEvents.dto';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('GalleryEvents')
@Controller('gallery-events')
export class GalleryEventsController {
    constructor(private readonly galleryEventService: GalleryEventsService) {}

    @Post('/createGalleryEvent/:roomId/:personId')
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
    async createGalleryEvent(
        @Param('roomId', ParseUUIDPipe) roomId: string,
        @Param('personId', ParseUUIDPipe) personId: string,
        @Req() req: any,
        @Body() event: createEventDto,
    ) {
        return await this.galleryEventService.createGalleryEvent(personId, roomId, req.userId, event.event_type)
    }
}
