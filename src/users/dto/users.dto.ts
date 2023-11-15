import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export class UserDto {
    id_user: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập mã nhân viên' })
    id_employee: string;

    @ApiProperty()
    @Matches(/^((09|03|07|08)\d{8}|(84|(\+84))\d{9})$/, {
        message: 'Username invalid',
    })
    @IsNotEmpty({ message: 'Vui lòng nhập username' })
    username: string;

    @ApiProperty()
    @Matches(/^[0-9]{6}$/, {
        message: 'Mật khẩu phải là chuỗi số và có đúng 6 ký',
    })
    @IsNotEmpty({ message: 'Vui lòng nhập password' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập đủ tên' })
    @Matches(/^(?:\S+\s+){1,}\S{2,}$/, { message: 'Fullname must be least 3 characters and space' })
    fullname: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    role?: string | null;

    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập phòng ban' })
    @IsString()
    name_department: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    type_vehicle: string | null;

    @ApiProperty()
    @IsString()
    @IsOptional()
    license_plate: string | null;

}
