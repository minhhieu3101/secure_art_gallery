import { Body, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create_account.dto';
import { User } from '../users/users.entity';
import { Role } from '../../commons/enum/roles.enum';
import { LoginDto } from './dto/login.dto';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

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
    login(@Body() userLogin: LoginDto): Promise<any> {
        try {
            return this.authService.login(userLogin.account, userLogin.password);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('refresh')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    refreshAccessToken(@Req() req: any, @Body() input: RefreshDto){
        try {
            return this.authService.refreshAccessToken(req.sid, input.refreshToken);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Post('logout')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async logout(@Req() req: any){
        try {
            return await this.authService.logout(req.sid)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
