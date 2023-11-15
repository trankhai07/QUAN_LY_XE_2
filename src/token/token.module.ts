import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { DepartmentService } from 'src/department/department.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Department } from 'src/department/entities/department.entity';
import { Vehicle } from 'src/vehicles/entities/vehicles.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Token,User,Department,Vehicle])
  ],
  providers: [TokenService,UsersService, DepartmentService, VehiclesService]
})
export class TokenModule {}
