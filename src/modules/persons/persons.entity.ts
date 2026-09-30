import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { EntityBase } from '../../commons/database/baseEntity';

@Entity()
export class Person extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    // Optional relationship with Users
    @OneToOne(() => User, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'fkUserId' })
    user: User | null;
}