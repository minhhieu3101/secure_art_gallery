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

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private JwtService: jwtService,
        private readonly userService: UserService,
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
            const userId = await this.JwtService.verifyToken(token);
            const user = await this.userService.getYourInfo(userId.id)
            const userRole = user.role;
            request.userId = userId.id;
            request.userRole = userRole;
            if (roles.length > 0 && !roles.includes(userRole as Role)) {
                throw new HttpException(
                    `you are ${userRole} . You do not have permission to do this activity`,
                    HttpStatus.NOT_ACCEPTABLE,
                );
            }
            return true;
        } catch (err) {
            if (err instanceof HttpException && err.getStatus() === HttpStatus.NOT_ACCEPTABLE) {
                throw err;
            }
            throw new HttpException('Can not get the token or You have timed out for login', HttpStatus.BAD_REQUEST);
        }
    }
}
