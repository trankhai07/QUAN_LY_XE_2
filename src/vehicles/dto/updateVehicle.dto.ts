import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateVehicleDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập loại xe' })
    type: string;

    @ApiProperty()
    @IsNumber()
    seats: number;


}