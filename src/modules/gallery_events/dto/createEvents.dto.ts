import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EventGalleryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class EventRoomDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    room_number: number;
}