import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class UpdateInfor {

    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập đủ tên' })
    @Matches(/^(?:\S+\s+){1,}\S{2,}$/, { message: 'Fullname must be least 3 characters and space' })
    fullname: string;
}