import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';
import { Session } from './sessions.entity';

@Injectable()
export class SessionRepository extends RepositoryUtils<Session> {
    constructor(@InjectRepository(Session) private sessionRepository: Repository<Session>) {
        super(sessionRepository);
    }
}