import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePersonDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
