import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateDepartmentDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string | null;
}