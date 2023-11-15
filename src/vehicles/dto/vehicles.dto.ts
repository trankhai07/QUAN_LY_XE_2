import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VehicleDto {
    id_vehicle: number;

    @ApiProperty({ example: '9 chỗ' })
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập loại xe' })
    type: string;

    @ApiProperty({ example: 'B30-12345' })
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập biển số xe' })
    license_plate: string;

    @ApiProperty({ example: 9 })
    @IsNumber()
    seats: number;

    status_vehicle: string | null;
}