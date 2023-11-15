import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DepartmentDto {
    id_department: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name_department: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string | null;
}