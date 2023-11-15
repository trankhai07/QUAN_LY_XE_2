import { registerAs } from "@nestjs/config";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import validateConfig from "src/utils/validators/validate-config";
import { AppConfig } from "./config.type";


enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariablesValidator {
    @IsEnum(Environment)
    @IsOptional()
    NODE_ENV: Environment;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsOptional()
    APP_PORT: number;

    @IsString()
    @IsOptional()
    API_PREFIX: string;
}
export default registerAs<AppConfig>('app', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);
    console.log(2);
    return {
        nodeEnv: process.env.NODE_ENV || 'development',
        name: process.env.APP_NAME || 'app',
        workingDirectory: process.env.PWD || process.cwd(),
        port: process.env.APP_PORT
            ? parseInt(process.env.APP_PORT, 10)
            : process.env.PORT
                ? parseInt(process.env.PORT, 10)
                : 3002,
        apiPrefix: process.env.API_PREFIX || 'api',
    };
});