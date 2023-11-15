import { AuthConfig } from './config/config.type';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';
import { VehiclesModule } from './vehicles/vehicles.module';
import { UsersModule } from './users/users.module';
import { DepartmentModule } from './department/department.module';
import { BookingDetailsModule } from './booking-details/booking-details.module';

import { ReasonController } from './reason/reason.controller';
import { ReasonModule } from './reason/reason.module';

import { AuthModule } from './auth/auth.module';

import { TokenModule } from './token/token.module';

import { MailModule } from './mail/mail.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, TypeORMError } from 'typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import fileConfig from './config/file.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        fileConfig,
        authConfig
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    VehiclesModule,
    UsersModule,
    DepartmentModule,
    BookingDetailsModule,
    ReasonModule,
    AuthModule,
    TokenModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule
  ],
  controllers: [ReasonController],
  providers: [{
    provide: APP_FILTER,
    useClass: ExceptionsLoggerFilter,
  },]
})
export class AppModule { }
