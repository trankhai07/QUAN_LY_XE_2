import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicles.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Vehicle])
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule {}
