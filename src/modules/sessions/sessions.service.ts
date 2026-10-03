import { HttpException, Injectable } from '@nestjs/common';
import { SessionRepository } from './sessions.repository';
import { Session } from './sessions.entity';
import { User } from '../users/users.entity';
import { ConfigService } from '@nestjs/config';
import { MoreThan, IsNull } from 'typeorm';

@Injectable()
export class SessionsService {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private configService: ConfigService,
    ) {}

    async createSession(refreshToken: string, user: User): Promise<Session> {
        if (refreshToken == null || user == null) {
            throw new HttpException('input null', 500);
        }
        const expiration = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') as string;
        const expiredAt = new Date();
        if (expiration.endsWith('d')) {
            const days = parseInt(expiration);
            expiredAt.setDate(expiredAt.getDate() + days);
        }
        return await this.sessionRepository.save({
            refreshToken: refreshToken,
            expired_at: expiredAt,
            user: user,
        });
    }

    async checkActiveSessions(user: User): Promise<boolean> {
        const activeSessions = await this.sessionRepository.count({
            where: {
                user: user,
                revoked_at: IsNull(),
                expired_at: MoreThan(new Date()),
            },
        });

        return activeSessions < 5;
    }

    async getSessionById(id: string): Promise<Session> {
        const session = await this.sessionRepository.getByCondition({
            where: {
                id: id,
                expired_at: MoreThan(new Date()),
                revoked_at: IsNull(),
            },
        });
        if (!session) {
            throw new HttpException('Can not find the session', 401);
        }
        return session;
    }

    async getSessionByRefreshToken(refreshToken: string): Promise<Session> {
        const session = await this.sessionRepository.getByCondition({
            where: {
                refreshToken: refreshToken,
                expired_at: MoreThan(new Date()),
                revoked_at: IsNull(),
            },
        });
        if (!session) {
            throw new HttpException('Can not find the session', 401);
        }
        return session;
    }
}
