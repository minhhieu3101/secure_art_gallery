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

    async createGalleryEvent(personId: string, roomId: string, employeeId: string, event_type: GalleryEventType) {
        try {
            const person = await this.personService.getPerson(personId);
            if (!person) {
                throw new HttpException('Can not find person', 400);
            }
            const room = await this.roomService.getRoom(roomId);
            if (!room) {
                throw new HttpException('Can not find room', 400);
            }
            const employee = await this.userService.getYourInfo(employeeId);
            if (!employee) {
                throw new HttpException('Can not find employee to record', 400);
            }
            await this.galleryEventRepository.save({
                event_type: event_type,
                person: person,
                room: room,
                recorded_by: employee,
            });
        } catch (error) {
            throw error;
        }
    }

    async enterGallery(personId: string, employeeId: string) {
        try {
            const person = await this.personService.getPerson(personId);
            if (!person) {
                throw new HttpException('Can not find person', 400);
            }
            const lastEvent = await this.galleryEventRepository.getByCondition({
                where: {
                    person: person,
                },
                order: {
                    createdAt: 'DESC',
                },
            });
            if (
                lastEvent &&
                (lastEvent.event_type === GalleryEventType.ENTER_GALLERY ||
                    lastEvent.event_type === GalleryEventType.ENTER_ROOM)
            ) {
                throw new HttpException('Person is already inside the gallery', 400);
            }

            const employee = await this.userService.getYourInfo(employeeId);
            if (!employee) {
                throw new HttpException('Can not find employee to record', 400);
            }
            return await this.galleryEventRepository.save({
                event_type: GalleryEventType.ENTER_GALLERY,
                person: person,
                recorded_by: employee,
            });
        } catch (error) {
            throw error;
        }
    }

    async leaveGallery(personId: string, employeeId: string) {
        try {
            const person = await this.personService.getPerson(personId);
            if (!person) {
                throw new HttpException('Can not find person', 400);
            }
            const lastEvent = await this.galleryEventRepository.getByCondition({
                where: {
                    person: person,
                },
                order: {
                    createdAt: 'DESC',
                },
            });
            if (!lastEvent || lastEvent.event_type === GalleryEventType.LEAVE_GALLERY) {
                throw new HttpException('Person is not inside the gallery', 400);
            }

            if (lastEvent.event_type === GalleryEventType.ENTER_ROOM) {
                throw new HttpException('Person must leave the room before leaving the gallery', 400);
            }
            const employee = await this.userService.getYourInfo(employeeId);
            if (!employee) {
                throw new HttpException('Can not find employee to record', 400);
            }
            return await this.galleryEventRepository.save({
                event_type: GalleryEventType.LEAVE_GALLERY,
                person: person,
                recorded_by: employee,
            });
        } catch (error) {
            throw error;
        }
    }

    async enterRoom(personId: string, roomId: string, employeeId: string){
        const person = await this.personService.getPerson(personId);
        if (!person) {
            throw new HttpException('Can not find person', 400);
        }
        const lastEvent = await this.galleryEventRepository.getByCondition({
            where: {
                person: person,
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (!lastEvent || lastEvent.event_type === GalleryEventType.LEAVE_GALLERY){
            throw new HttpException('Person is not inside the gallery', 400);
        }
        if (lastEvent.event_type === GalleryEventType.ENTER_ROOM){
            throw new HttpException('Person is already inside the room', 400);
        }
        const room = await this.roomService.getRoom(roomId);
        if (!room) {
            throw new HttpException('Can not find the room', 400);
        }
        const employee = await this.userService.getYourInfo(employeeId);
        if (!employee) {
            throw new HttpException('Can not find employee to record', 400);
        }
        return await this.galleryEventRepository.save({
            event_type: GalleryEventType.ENTER_ROOM,
            person: person,
            room: room,
            recorded_by: employee,
        });
        
    }

    async leaveRoom(personId: string, roomId: string, employeeId: string){
        const person = await this.personService.getPerson(personId);
        if (!person) {
            throw new HttpException('Can not find person', 400);
        }
        const lastEvent = await this.galleryEventRepository.getByCondition({
            where: {
                person: person,
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (!lastEvent || lastEvent.event_type === GalleryEventType.LEAVE_GALLERY){
            throw new HttpException('Person is not inside the gallery', 400);
        }
        if (lastEvent.event_type === GalleryEventType.ENTER_GALLERY || lastEvent.event_type === GalleryEventType.LEAVE_ROOM ){
            throw new HttpException('Person is not inside the room', 400);
        }
        const room = await this.roomService.getRoom(roomId);
        if (!room) {
            throw new HttpException('Can not find the room', 400);
        }
        const employee = await this.userService.getYourInfo(employeeId);
        if (!employee) {
            throw new HttpException('Can not find employee to record', 400);
        }
        return await this.galleryEventRepository.save({
            event_type: GalleryEventType.LEAVE_ROOM,
            person: person,
            room: room,
            recorded_by: employee,
        });
    }
}
