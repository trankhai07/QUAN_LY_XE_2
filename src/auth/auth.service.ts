import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';

import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/bycrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private tokenService: TokenService) {
    }
    async validateUser(username: string, password: string): Promise<User> {
        const userDB = await this.userService.findUserByUsername(username);
        if (userDB) {
            const match = comparePassword(password, userDB.password);
            if (match) {
                return userDB;
            }
            else throw new BadRequestException('Mật khẩu không hợp lệ, vui lòng liên hệ Admin hệ thống');
        }
        return null;
    }


    async login(user: User) {


        const { password, ...userWithoutPasswrod } = user;
        const payload = {
            username: userWithoutPasswrod.username,
            sub: {
                id_user: userWithoutPasswrod.id_user,
                id_employee: userWithoutPasswrod.id_employee
            },
            role: user.role
        }

        const refreshToken = await this.jwtService.sign(payload, { secret: `${process.env.REFRESH_SECRET}`, expiresIn: `${process.env.REFRESH_EXPIRESIN}` });
        await this.tokenService.createToken(user, refreshToken);

        return {
            type: 'success',
            message: 'Đăng nhập thành công!',
            user: { ...userWithoutPasswrod },
            accessToken: this.jwtService.sign(payload),
            refreshToken: refreshToken
        }
    }

    async refreshToken(user: any) {

        const payload = {
            username: user.username,
            sub: {
                id_user: user.id.id_user,
                id_employee: user.id.id_employee,
            },
            role: user.role
        }
        console.log(payload.sub);
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
