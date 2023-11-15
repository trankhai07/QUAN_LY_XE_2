import { registerAs } from "@nestjs/config";
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min, ValidateIf } from "class-validator";
import { DatabaseConfig } from "./config.type";
import validateConfig from "src/utils/validators/validate-config";



class EnviromentVariablesValidator {

    // rang buoc thể hiện rằng chỉ khi database_url tồn tại giá trị mới bị kiểm tra
    @ValidateIf((envValues) => envValues.DATABASE_URL)
    @IsString()
    DATABASE_URL: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_TYPE: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_HOST: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsInt()
    @Min(0)
    @Max(65535)
    @IsOptional()
    DATABASE_PORT: number;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    @IsOptional()
    DATABASE_PASSWORD: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_NAME: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_USERNAME: string;

    @IsBoolean()
    @IsOptional()
    DATABASE_SYNCHRONIZE: boolean;

    @IsInt()
    @IsOptional()
    DATABASE_MAX_CONNECTIONS: number;

    @IsBoolean()
    @IsOptional()
    DATABASE_SSL_ENABLED: boolean;

    @IsBoolean()
    @IsOptional()
    DATABASE_REJECT_UNAUTHORIZED: boolean;

    @IsString()
    @IsOptional()
    DATABASE_CA: string;

    @IsString()
    @IsOptional()
    DATABASE_KEY: string;

    @IsString()
    @IsOptional()
    DATABASE_CERT: string;
}

// đặt tên cho DatabaseConfig là database
export default registerAs<DatabaseConfig>('database', () => {
    validateConfig(process.env, EnviromentVariablesValidator);
    console.log(1);
    return {
        url: process.env.DATABASE_URL,
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT
            ? parseInt(process.env.DATABASE_PORT, 10)
            : 5432,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
        maxConnections: process.env.DATABASE_MAX_CONNECTIONS
            ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
            : 100,
        // sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
        // rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
        // ca: process.env.DATABASE_CA,
        // key: process.env.DATABASE_KEY,
        // cert: process.env.DATABASE_CERT,
    };
})