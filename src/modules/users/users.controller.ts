
import { RolesGuard } from '../guards/roles.guard';
import { forgotPasswordDTO } from './dto/forgotPassword.dto';
import { VerifyUser } from './dto/verifyUser.dto';
import {
    Body,
    Controller,
    Patch,
    Post,
    Req,
    UseGuards,
    Get,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
    Delete,
    ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { sendOtpDTO } from './dto/sendOTP.dto';
import { changePasswordDTO } from './dto/changePassword.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../../commons/enum/roles.enum';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/user/verify')
    verifyAccount(@Body() info: VerifyUser) {
        return this.userService.verifyUser(info.email, info.otp);
    }

    @Post('/user/sendOTP')
    sendOTP(@Body() info: sendOtpDTO) {
        return this.userService.sendOTP(info.email);
    }

    @Patch('/user/forgot-password')
    forgotPassword(@Body() info: forgotPasswordDTO) {
        return this.userService.forgotPassword(info.email, info.otp, info.password);
    }


    @Get('/user')
    @Roles()
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    getYourInfo(@Req() req: any) {
        const userId = req.userId;
        return this.userService.getYourInfo(userId);
    }

    @Get('/dashboard/user')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    getAllUser() {
        return this.userService.getAllUser();
    }

    @Patch('/user/change-password')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    changePassword(@Body() info: changePasswordDTO, @Req() req: any) {
        const userId = req.userId;
        return this.userService.changePassword(userId, info.password, info.newPassword);
    }


    @Patch('/admin/user/grant/:userId')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'userId',
        format: 'uuid',
        type: 'string',
    })
    @ApiBearerAuth()
    grantPermission(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.userService.grantPermission(userId);
    }

    @Delete('/admin/user/:userId')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'userId',
        format: 'uuid',
        type: 'string',
    })
    deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.userService.deleteUser(userId);
    }

    @Get('/dashboard/log')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    async getAllLogs() {
        try {
            return await this.userService.getAllLogs();
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Get('/dashboard/log/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    async getLogByUserID(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.userService.getLogbyUserID(id);
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}