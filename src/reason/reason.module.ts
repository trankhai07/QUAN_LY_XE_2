import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonController } from './reason.controller';
import { ReasonService } from './reason.service';
import { BookingDetail } from 'src/booking-details/entities/bookingdetail.entity';
import { BookingDetailsService } from 'src/booking-details/booking-details.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';
import { Vehicle } from 'src/vehicles/entities/vehicles.entity';
import { Department } from 'src/department/entities/department.entity';
import { Token } from 'src/token/entities/token.entity';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Reason } from './entities/reason.entity';
import { TokenService } from 'src/token/token.service';
import { DepartmentService } from 'src/department/department.service';

@Module({
    imports:[TypeOrmModule.forFeature([BookingDetail, User,Vehicle, Token, Department, Reason])],
    controllers: [ReasonController],
    providers: [BookingDetailsService, UsersService, VehiclesService, TokenService, DepartmentService, ReasonService]
  })
export class ReasonModule {

}
