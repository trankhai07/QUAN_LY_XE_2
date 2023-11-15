import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lấy từ client request về
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }
    
    async validate(payload: any) {
        console.log("1");
        return { id: payload.sub, username: payload.username, role: payload.role };
    }
}