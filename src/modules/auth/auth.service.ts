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
            const accessToken = await this.JwtService.signToken(
                { id: userId },
                {
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                },
            );

            const refreshToken = await this.JwtService.signToken(
                { id: userId },
                {
                    expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
                },
            );
            await this.sessionService.createSession(refreshToken, user)
            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    async getNewToken(refreshToken: string): Promise<any> {
        try {
            const userId = (await this.JwtService.verifyToken(refreshToken)).id;
            const user = await this.userService.getYourInfo(userId);
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            const accessToken = await this.JwtService.signToken(
                { id: userId },
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
}