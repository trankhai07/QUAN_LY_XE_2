import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { User } from "src/users/entities/users.entity";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) {
        super();  // từ cổng guard dẫn vào đây lấy tên mặc định username, password => function validate
    }

    async validate(username: string, password: string): Promise<User> {
        // Kiểm tra định dạng số điện thoại
        const userNameRegex = /^((09|03|07|08)\d{8}|(84|(\+84))\d{9})$/;
        if (!userNameRegex.test(username)) {
            throw new BadRequestException('Tên đăng nhập phải là số điện thoại');
        }

        // Kiểm tra độ dài password
        const passwordRegex = /^[0-9]{6}$/;
        if (!passwordRegex.test(password) || typeof password === 'number') {
            throw new BadRequestException('Mật khẩu phải là chuỗi số và có đúng 6 ký');
        }
        const user = await this.authService.validateUser(username, password);
        if (!user) throw new BadRequestException('Tài khoản không tồn tại')
        return user;
    }
}