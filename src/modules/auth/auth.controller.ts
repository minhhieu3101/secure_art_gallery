import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiQuery } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create_account.dto';
import { User } from '../users/users.entity';
import { Role } from '../../commons/enum/roles.enum';
import { LoginDto } from './dto/login.dto';
import { refreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiQuery({ name: 'role', enum: Role })
    register(@Body() user: CreateAccountDto): Promise<User> {
        return this.authService.register(user);
    }

    @Post('login')
    login(@Body() userLogin: LoginDto): Promise<any> {
        return this.authService.login(userLogin.account, userLogin.password);
    }

    @Post('getToken')
    getNewToken(@Body() refreshToken: refreshTokenDto): Promise<any> {
        return this.authService.getNewToken(refreshToken.refreshToken);
    }
}
