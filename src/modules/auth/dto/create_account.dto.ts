import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullname: string;
}