import { HttpException, Injectable } from '@nestjs/common';
import { GalleryEventRepository } from './gallery_events.repository';
import { Person } from '../persons/persons.entity';
import { Room } from '../rooms/rooms.entity';
import { GalleryEventType } from '../../commons/enum/events.enum';
import { PersonService } from '../persons/persons.service';
import { UserService } from '../users/users.service';
import { RoomService } from '../rooms/rooms.service';

@Injectable()
export class GalleryEventsService {
    constructor(
        private readonly galleryEventRepository: GalleryEventRepository,
        private readonly personService: PersonService,
        private readonly roomService: RoomService,
        private readonly userService: UserService,
    ) {}

    async createGalleryEvent(personId: string, roomId: string, userId: string, event_type: GalleryEventType) {
        try {
            const person = await this.personService.getPerson(personId)
            if (!person){
                throw new HttpException('Can not find person', 400)
            }
            const room = await this.roomService.getRoom(roomId)
            if (!room){
                throw new HttpException('Can not find room', 400)
            }
            const user = await this.userService.getYourInfo(userId)
            if (!user){
                throw new HttpException('Can not find employee to record', 400)
            }
            await this.galleryEventRepository.save({
                event_type: event_type,
                person: person,
                room: room,
                recorded_by: user
            });
        } catch (error) {
            throw error;
        }
    }
}
