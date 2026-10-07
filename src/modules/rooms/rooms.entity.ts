import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { EntityBase } from '../../commons/database/baseEntity';
import { RoomStatus } from '../../commons/enum/room.status';

@Entity()
export class Room extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    number: number;

    @Column()
    occupancy: number;

    @Column({default: 0})
    people: number

    @Column({
        type: 'enum',
        enum: RoomStatus,
        default: RoomStatus.open,
    })
    status: RoomStatus;
}
