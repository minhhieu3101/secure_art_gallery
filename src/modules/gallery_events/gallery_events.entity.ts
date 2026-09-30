import { EntityBase } from '../../commons/database/baseEntity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { GalleryEventType } from '../../commons/enum/events.enum';
import { Person } from '../persons/persons.entity';
import { Room } from '../rooms/rooms.entity';
import { User } from '../users/users.entity';

@Entity()
export class GalleryEvent extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: GalleryEventType,
    })
    event_type: GalleryEventType;

    // Person involved in the event
    @ManyToOne(() => Person, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn()
    person: Person;

    // Room where the event happened
    @ManyToOne(() => Room, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn()
    room: Room;
    
    @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn()
    recorded_by: User;
}
