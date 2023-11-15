import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class DayMonthYear {
    @ApiProperty({ example: '2023/11/13', format: 'date' })
    @Type(() => Date)
    @IsDate({ message: 'Ngày phải có định dạng YYYY/MM/DD' })
    @IsNotEmpty({ message: 'Vui lòng nhập Ngày đi dự kiến' })
    date_start: string;


    @ApiProperty({ example: '2023/11/20', format: 'date' })
    @Type(() => Date)
    @IsDate({ message: 'Ngày phải có định dạng YYYY/MM/DD' })
    @IsNotEmpty({ message: 'Vui lòng nhập Ngày về dự kiến' })
    date_end: string;

}