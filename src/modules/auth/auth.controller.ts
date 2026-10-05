import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    Req,
    Res,
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
            return {
                accessToken: result.accessToken,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('refresh')
    async refreshAccessToken(@Req() req: any) {
        try {
            const sid = req.cookies?.sid;
            const refreshToken = req.cookies?.refreshToken;
            return await this.authService.refreshAccessToken(sid, refreshToken);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('logout')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async logout(@Req() req: any) {
        try {
            return await this.authService.logout(req.sid);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
