import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(3)
    number: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    occupancy: string;
}
