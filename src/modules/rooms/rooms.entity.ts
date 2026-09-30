import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { EntityBase } from '../../commons/database/baseEntity';

@Entity()
export class Room extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    number: number;
}
