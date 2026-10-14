import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create_account.dto';
import { User } from '../users/users.entity';
import { Role } from '../../commons/enum/roles.enum';
import { LoginDto } from './dto/login.dto';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { RefreshDto } from './dto/refresh.dto';
import express from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiQuery({ name: 'role', enum: Role })
    register(@Body() user: CreateAccountDto): Promise<User> {
        try {
            return this.authService.register(user);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('login')
    async login(@Body() userLogin: LoginDto, @Res({ passthrough: true }) response: express.Response): Promise<any> {
        try {
            const result = await this.authService.login(userLogin.email, userLogin.password);
            response.cookie('sid', result.sid, {
                httpOnly: true,
                secure: false, // localhost
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            response.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/auth',
            });
            console.log(result);
            return {
                accessToken: result.accessToken,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('refresh')
    async refreshAccessToken(@Req() req: any, @Res({ passthrough: true }) response: express.Response) {
        try {
            const sid = req.cookies?.sid;
            const refreshToken = req.cookies?.refreshToken;
            if (!sid || !refreshToken) {
                throw new UnauthorizedException('Missing session or refresh token');
            }
            return await this.authService.refreshAccessToken(sid, refreshToken);
        } catch (error) {
            console.log(error);
            response.clearCookie('sid', {
                path: '/login',
                sameSite: 'lax',
                secure: false,
            });

            response.clearCookie('refreshToken', {
                path: '/login',
                sameSite: 'lax',
                secure: false,
            });

            throw error;
        }
    }

    @Post('logout')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async logout(@Req() req: any, @Res({ passthrough: true }) res: express.Response) {
        try {
            await this.authService.logout(req.sid);

            res.clearCookie('sid', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/auth',
            });

            return { message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }
}
