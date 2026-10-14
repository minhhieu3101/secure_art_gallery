import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../../../commons/enum/roles.enum";
import { ApiProperty } from "@nestjs/swagger";

export class GrantDTO {
    @ApiProperty({ enum: Role })
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}