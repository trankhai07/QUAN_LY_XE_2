export type AppConfig = {
    nodeEnv: string;
    name: string;
    port: number;
    apiPrefix: string;
}

export type FileConfig = {
    driver: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    awsDefaultS3Bucket?: string;
    awsDefaultS3Url?: string;
    awsS3Region?: string;
    maxFileSize: number;
}

export type AuthConfig = {
    secret?: string;
    expires?: string;
    refreshSecret?: string;
    refreshExpires?: string;
}
export type DatabaseConfig = {
    url?: string;
    type?: string;
    host?: string;
    port?: number;
    password?: string;
    name?: string;
    username?: string;
    synchronize: boolean;
    maxConnections: number;
    sslEnabled?: boolean;
    rejectUnauthorized?: boolean;
    ca?: string;
    key?: string;
    cert?: string;
}
export type AllConfigType = {
    database: DatabaseConfig;
    app: AppConfig;
    file: FileConfig;
    auth: AuthConfig;
}