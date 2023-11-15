import { registerAs } from "@nestjs/config";
import { IsString } from "class-validator";
import validateConfig from "src/utils/validators/validate-config";
import { AuthConfig } from "./config.type";

class EnvironmentVariablesValidator {
    @IsString()
    JWT_SECRET: string;

    @IsString()
    ACCESS_EXPIRESIN: string;

    @IsString()
    REFRESH_SECRET: string;

    @IsString()
    REFRESH_EXPIRESIN: string;
}
export default registerAs<AuthConfig>('auth', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        secret: process.env.JWT_SECRET,
        expires: process.env.ACCESS_EXPIRESIN,
        refreshSecret: process.env.REFRESH_SECRET,
        refreshExpires: process.env.REFRESH_EXPIRESIN,
    };
});
