import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { Equals, IsDate, IsDateString, IsEmpty, IsNotEmpty, IsNumber, IsString, Matches, Min, NotEquals } from "class-validator";

export class BookingDetailDto {
    id_booking: number;

    @ApiProperty({ example: '2023/11/13', format: 'date' })
    @Type(() => Date)
    @IsDate({ message: 'Ngày phải có định dạng YYYY/MM/DD' })
    @IsNotEmpty({ message: 'Vui lòng nhập Ngày đi dự kiến' })
    // @Matches(/^\d{4}\/\d{2}\/\d{2}$/, { message: 'Ngày phải có định dạng YYYY/MM/DD' })
    date_start: string;

    @ApiProperty({ example: '16:00', format: 'time' })
    @IsNotEmpty({ message: 'Vui lòng nhập Thời gian đi dự kiến' })
    @Matches(/^\d{2}:\d{2}$/, { message: 'Thời gian phải có định dạng HH:mm' })
    time_start: string;

    @ApiProperty({ example: '2023/11/20', format: 'date' })
    @Type(() => Date)
    @IsDate({ message: 'Ngày phải có định dạng YYYY/MM/DD' })
    @IsNotEmpty({ message: 'Vui lòng nhập Ngày về dự kiến' })
    // @Matches(/^\d{4}\/\d{2}\/\d{2}$/, { message: 'Ngày phải có định dạng YYYY/MM/DD' })
    date_end: string;

    @ApiProperty({ example: '12:00', format: 'time' })
    @IsNotEmpty({ message: 'Vui lòng nhập Thời gian về dự kiến' })
    @Matches(/^\d{2}:\d{2}$/, { message: 'Thời gian phải có định dạng HH:mm' })
    time_end: string;

    @ApiProperty({ example: '15 Nguyễn Văn Trỗi, Hà Nội' })
    @IsNotEmpty({ message: 'Vui lòng nhập Địa điểm xuất phát' })
    @IsString()
    location_start: string;

    @ApiProperty({ example: '242 Trương Chinh, Nam Định' })
    @IsNotEmpty({ message: 'Vui lòng nhập Địa điểm đến' })
    @IsString()
    location_end: string;

    @ApiProperty({ example: 2 })
    @IsNotEmpty({ message: 'Vui lòng nhập Số người đi' })
    @IsNumber()
    @Min(1, { message: 'Số người đi phải lớn hơn 0' })
    numbers_passenger: number


    @ApiProperty({ example: 'Nhân viên giám sát' })
    @IsNotEmpty({ message: 'Vui lòng nhập Chức danh người đi' })
    @IsString()
    position_title: string;

    @ApiProperty({ example: 'Nguyễn Văn A' })
    @IsNotEmpty({ message: 'Vui lòng nhập Họ và Tên người đề nghị' })
    @IsString()
    fullname_booking: string;

    @ApiProperty({ example: 'Đi tìm vị trí thuê mới' })
    @IsNotEmpty({ message: 'Vui lòng nhập Lý do đặt xe' })
    @IsString()
    reason_booking: string;

    @ApiProperty({ example: 'Ngoại Thành' })
    @IsNotEmpty({ message: 'Vui lòng chọn Khu vực' })
    @IsString() // select: Nội thành , Ngoại thành
    area: string;

    status_booking: string | null;
  
}