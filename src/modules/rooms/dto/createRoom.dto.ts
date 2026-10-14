import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { RoomStatus } from '../../../commons/enum/room.status';

export class CreateRoomDto {
    @ApiProperty({ example: 106 })
    @IsNotEmpty()
    @IsInt()
    @Min(100)
    @Max(999)
    number: number;
  
    @ApiProperty({ example: 50 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    occupancy: number;
  }

export class ChangeRoomStatusDTO {
    @ApiProperty({ example: 106 })
    @IsNotEmpty()
    @IsInt()
    @Min(100)
    @Max(999)
    number: number;

    @ApiProperty({ enum: RoomStatus })
    @IsNotEmpty()
    @IsEnum(RoomStatus)
    status: RoomStatus;
}
