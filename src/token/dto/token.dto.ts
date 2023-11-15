import { IsNotEmpty, IsString } from "class-validator";

export class TokenDto {
    id_token: number;

    @IsString()
    @IsNotEmpty({ message: 'Vui lòng nhập username' })
    username: string;

    @IsNotEmpty({ message: 'RefreshToken không được để trống' })
    refreshToken: string;
}