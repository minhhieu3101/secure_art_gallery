import { EntityBase } from '../../commons/database/baseEntity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Session extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refreshToken: string;

    @Column()
    expired_at: Date;

    @Column()
    revoked_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'fkUserId' })
    userId: User;
}