import { jwtService } from './../jwts/jwts.service';
import { Role } from '../../commons/enum/roles.enum';
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private JwtService: jwtService,
        private readonly userService: UserService,
        private readonly sessionService: SessionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());
        const request = context.switchToHttp().getRequest();
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('Missing or invalid Authorization header');
            }
            const token = request.headers.authorization.replace('Bearer ', '');
            const payload = await this.JwtService.verifyToken(token);
            const session = await this.sessionService.getSessionById(payload.sid);
            if (!session) {
                throw new HttpException('This session has expired', 401);
            }
            const user = await this.userService.getYourInfo(payload.id);
            const userRole = user.role;
            request.userId = payload.id;
            request.userRole = userRole;
            request.sid = payload.sid
            if (roles.length > 0 && !roles.includes(userRole as Role)) {
                throw new HttpException(
                    `you are ${userRole} . You do not have permission to do this activity`,
                    HttpStatus.NOT_ACCEPTABLE,
                );
            }
            return true;
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException && err.getStatus() === HttpStatus.NOT_ACCEPTABLE) {
                throw err;
            }
            throw new HttpException('Can not get the token or You have timed out for login', HttpStatus.BAD_REQUEST);
        }
    }
}
