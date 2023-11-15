
import { Body, Controller, Delete, Get, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/JwtAuthGuard';
import { RolesGuard } from 'src/auth/guard/RoleGuard';
import { UserRole } from 'src/enum/enum.role';
import { VehicleDto } from './dto/vehicles.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';

@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller({ path: 'vehicles', version: '2' })
@UseGuards(JwtGuard, new RolesGuard([UserRole.ADMIN]))
export class VehiclesController {
    constructor(private vehicleService: VehiclesService) {

    }

    @Get('/list')
    getListVehicle() {
        return this.vehicleService.getListVehicle();
    }
    @Post('/create')
    createVehicle(@Body() vehicle: VehicleDto) {
        return this.vehicleService.createVehicle(vehicle);
    }

    @Patch('/update')
    @ApiQuery({ name: 'id_vehicle', type: 'number', required: true })
    updateVehicle(@Body() updateVehicle: UpdateVehicleDto, @Request() req) {
        return this.vehicleService.updateVehicle(updateVehicle, req.query.id_vehicle)
    }

    @Delete('/delete')
    @ApiQuery({ name: 'id_vehicle', type: 'number', required: true })
    deleteVehicle(@Request() req) {
        const vehicle = this.vehicleService.deleteVehicle(req.query.id_vehicle);
        if (vehicle) return { status: 200, message: 'Successfull' };
    }
}
