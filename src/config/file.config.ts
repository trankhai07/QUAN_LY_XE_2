import { registerAs } from "@nestjs/config";
import { IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";
import validateConfig from "src/utils/validators/validate-config";
import { FileConfig } from "./config.type";

enum FileDriver {
    LOCAL = 'local',
    S3 = 's3',
}

class EnvironmentVariablesValidator {
    @IsEnum(FileDriver)
    FILE_DRIVER: FileDriver;

    @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
    @IsString()
    AWS_ACCESS_KEY: string;

    @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
    @IsString()
    AWS_SECRET_ACCESS_KEY: string;

    @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
    @IsString()
    AWS_PUBLIC_BUCKET_KEY: string;

    @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
    @IsString()
    @IsOptional()
    AWS_DEFAULT_S3_URL: string;

    @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
    @IsString()
    AWS_REGION: string;
}
export default registerAs<FileConfig>('file', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);
    return {
        driver: process.env.FILE_DRIVER ?? 'local',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        awsDefaultS3Bucket: process.env.AWS_PUBLIC_BUCKET_KEY,
        awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
        awsS3Region: process.env.AWS_REGION,
        maxFileSize: 5242880, // 5mb
    };
});