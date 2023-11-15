import { Module } from '@nestjs/common';
import { BookingDetailsController } from './booking-details.controller';
import { BookingDetailsService } from './booking-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetail } from './entities/bookingdetail.entity';
import { User } from 'src/users/entities/users.entity';
import { Vehicle } from 'src/vehicles/entities/vehicles.entity';
import { UsersService } from 'src/users/users.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Token } from 'src/token/entities/token.entity';
import { TokenService } from 'src/token/token.service';
import { Department } from 'src/department/entities/department.entity';
import { DepartmentService } from 'src/department/department.service';
import { Reason } from 'src/reason/entities/reason.entity';
import { ReasonService } from 'src/reason/reason.service';

@Module({
  imports:[TypeOrmModule.forFeature([BookingDetail, User,Vehicle, Token, Department, Reason])],
  controllers: [BookingDetailsController],
  providers: [BookingDetailsService, UsersService, VehiclesService, TokenService, DepartmentService, ReasonService]
})
export class BookingDetailsModule {}
