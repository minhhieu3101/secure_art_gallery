import { ConfigService } from '@nestjs/config';
import { UserService } from './../users/users.service';
import { Injectable, HttpException } from '@nestjs/common';
import { User } from '../users/users.entity';
import { jwtService } from '../jwts/jwts.service';
import { ERROR } from '../../commons/errorHandling/errorHandling';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly JwtService: jwtService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionsService
    ) {}
    async register(user: any): Promise<User> {
        try {
            const newUser = await this.userService.createUser(user);
            return newUser;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    async login(account: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findUserForLogin(account, password);
            const userId = user.id;
            if (!(await this.sessionService.checkActiveSessions(user))) {
                throw new HttpException('The user is logged in on 4 devices' , 500)
            }

            const refreshToken = await this.JwtService.signToken(
                { id: userId },
                {
                    expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
                },
            );
            const session = await this.sessionService.createSession(refreshToken, user)
            const accessToken = await this.JwtService.signToken(
                { id: userId, sid: session.id },
                {
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                },
            );
            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    async refreshAccessToken(sid: string, refreshToken_input: string): Promise<any> {
        try {
            const session = await this.sessionService.getSessionById(sid)
            if (session.refreshToken !== refreshToken_input) {
                throw new HttpException("Refresh Token is not correct", 401);
            }
            const user = session.user
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            // const session = await this.sessionService.getSessionByRefreshToken(refreshToken)
            const accessToken = await this.JwtService.signToken(
                { id: user.id, sid: session.id },
                {
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                },
            );
            return {
                accessToken: accessToken,
            };
        } catch (err) {
            throw err;
        }
    }

    async logout(sid: string){
        try {
            const session = await this.sessionService.getSessionById(sid)
            console.log(session)
            session.revoked_at = new Date();
            await session.save()
        } catch (error) {
            console.log(error)
            throw (error)
        }
    }
}