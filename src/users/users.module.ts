import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { DepartmentService } from 'src/department/department.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Department } from 'src/department/entities/department.entity';
import { Vehicle } from 'src/vehicles/entities/vehicles.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategy/JwtStrategy';
import { LocalStrategy } from 'src/auth/strategy/LocalStrategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token } from 'src/token/entities/token.entity';
import { TokenService } from 'src/token/token.service';
import { BookingDetailsService } from 'src/booking-details/booking-details.service';
import { BookingDetail } from 'src/booking-details/entities/bookingdetail.entity';
import { ReasonService } from 'src/reason/reason.service';
import { Reason } from 'src/reason/entities/reason.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports:[TypeOrmModule.forFeature([User, Department, Vehicle, Token, BookingDetail, Reason]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: configService.get('ACCESS_EXPIRESIN') },
    }),
    inject: [ConfigService],
  }),
  MailerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => ({
      transport: {
        host: config.get('MAIL_HOST'),
        secure: false,
        auth: {
          user: config.get('MAIL_USER'),
          pass: config.get('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: `No Reply<${config.get('MAIL_FROM')}`,
      },
      template: {
        dir: join(__dirname, '../../src/templates/email'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },

      }
    }),
    inject: [ConfigService]
  })
  ],
  controllers: [UsersController],
  providers: [UsersService, DepartmentService, VehiclesService, AuthService,LocalStrategy,JwtStrategy, TokenService, BookingDetailsService, ReasonService]
})
export class UsersModule {}
