import { HttpException, Injectable } from '@nestjs/common';
import { GalleryEventRepository } from './gallery_events.repository';
import { Room } from '../rooms/rooms.entity';
import { GalleryEventType } from '../../commons/enum/events.enum';
import { UserService } from '../users/users.service';
import { RoomService } from '../rooms/rooms.service';
import { AuditService } from '../audit/audit.service';
import { console } from 'inspector';

@Injectable()
export class GalleryEventsService {
    constructor(
        private readonly galleryEventRepository: GalleryEventRepository,
        private readonly roomService: RoomService,
        private readonly userService: UserService,
        private readonly auditService: AuditService,
    ) {}

    async enterGallery(email: string, employeeId: string) {
        try {
            const person = await this.userService.getbyEmail(email);
            if (!person) {
                throw new HttpException('Can not find person', 400);
            }
            const lastEvent = await this.galleryEventRepository.getByCondition({
                where: {
                    person: {
                        id: person.id,
                    },
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
            const event = await this.galleryEventRepository.save({
                event_type: GalleryEventType.ENTER_GALLERY,
                person: person,
                recorded_by: employee,
            });
            await this.auditService.appendLog(person.id, `User ${email} entered the gallery`);
            return event;
        } catch (error) {
            throw error;
        }
    }

    async leaveGallery(email: string, employeeId: string) {
        try {
            console.log('leaveGallery');
            const person = await this.userService.getbyEmail(email);
            if (!person) {
                throw new HttpException('Can not find person', 400);
            }
            const lastEvent = await this.galleryEventRepository.getByCondition({
                where: {
                    person: {
                        id: person.id,
                    },
                },
                order: {
                    createdAt: 'DESC',
                },
            });
            console.log(lastEvent);
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
            const event = await this.galleryEventRepository.save({
                event_type: GalleryEventType.LEAVE_GALLERY,
                person: person,
                recorded_by: employee,
            });
            await this.auditService.appendLog(person.id, `User ${email} left the gallery.`);
            return event;
        } catch (error) {
            throw error;
        }
    }

    async enterRoom(email: string, room_number: number, employeeId: string) {
        const person = await this.userService.getbyEmail(email);
        if (!person) {
            throw new HttpException('Can not find person', 400);
        }
        const room: Room = await this.roomService.getRoomByNumber(room_number);
        if (!room) {
            throw new HttpException('Can not find the room', 400);
        }
        const lastEvent = await this.galleryEventRepository.getByCondition({
            where: {
                person: {
                    id: person.id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (!lastEvent || lastEvent.event_type === GalleryEventType.LEAVE_GALLERY) {
            throw new HttpException('Person is not inside the gallery', 400);
        }
        if (lastEvent.event_type === GalleryEventType.ENTER_ROOM) {
            throw new HttpException('Person is already inside the room', 400);
        }
        const employee = await this.userService.getYourInfo(employeeId);
        if (!employee) {
            throw new HttpException('Can not find employee to record', 400);
        }
        const event = await this.galleryEventRepository.save({
            event_type: GalleryEventType.ENTER_ROOM,
            person: person,
            room: room,
            recorded_by: employee,
        });
        if (room.people == room.occupancy) {
            await event.remove();
            throw new HttpException('This room does not have sufficient capacity', 400);
        }
        room.people += 1;
        await room.save();
        await this.auditService.appendLog(person.id, `User ${email} entered Room ${room_number}.`);
        return event;
    }

    async leaveRoom(email: string, room_number: number, employeeId: string) {
        const person = await this.userService.getbyEmail(email);
        if (!person) {
            throw new HttpException('Can not find person', 400);
        }
        const room: Room = await this.roomService.getRoomByNumber(room_number);
        if (!room) {
            throw new HttpException('Can not find the room', 400);
        }
        const lastEvent = await this.galleryEventRepository.getByCondition({
            where: {
                person: {
                    id: person.id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (!lastEvent || lastEvent.event_type === GalleryEventType.LEAVE_GALLERY) {
            throw new HttpException('Person is not inside the gallery', 400);
        }
        if (
            lastEvent.event_type === GalleryEventType.ENTER_GALLERY ||
            lastEvent.event_type === GalleryEventType.LEAVE_ROOM
        ) {
            throw new HttpException('Person is not inside the room', 400);
        }
        const employee = await this.userService.getYourInfo(employeeId);
        if (!employee) {
            throw new HttpException('Can not find employee to record', 400);
        }
        const event = await this.galleryEventRepository.save({
            event_type: GalleryEventType.LEAVE_ROOM,
            person: person,
            room: room,
            recorded_by: employee,
        });
        room.people -= 1;
        await room.save();
        await this.auditService.appendLog(person.id, `User ${email} left Room ${room_number}.`);
        return event;
    }
}
