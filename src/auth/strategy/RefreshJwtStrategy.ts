import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),  // lấy từ client request về
            ignoreExpiration: false,
            secretOrKey: process.env.REFRESH_SECRET
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username, role: payload.role };
    }
}