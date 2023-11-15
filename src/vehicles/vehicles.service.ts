
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicles.entity';
import { Repository } from 'typeorm';
import { VehicleDto } from './dto/vehicles.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';

@Injectable()
export class VehiclesService {
    constructor(@InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>) {

    }

    async createVehicle(vehicle: VehicleDto): Promise<Vehicle> {
        const Vehicle = await this.findVehicleByLicense(vehicle.license_plate);
        if (!Vehicle)
            return this.vehicleRepository.save(
                this.vehicleRepository.create({ status_vehicle: 'Sẵn sàng', ...vehicle })
            );
        throw new BadRequestException('Xe đã tồn tại');
    }

    async deleteVehicle(id_vehicle: number): Promise<Vehicle> {
        const vehicle = await this.findVehicleById(id_vehicle);
        return this.vehicleRepository.remove(vehicle);
    }

    async updateVehicle(updateVehicle: UpdateVehicleDto, id_vehicle: number): Promise<Vehicle> {
        const vehicle = await this.findVehicleById(id_vehicle);
        vehicle.type = updateVehicle.type;
        vehicle.seats = updateVehicle.seats;
        return this.vehicleRepository.save(
            this.vehicleRepository.create(vehicle)
        );
    }
    findVehicleByLicense(license_plate: string): Promise<Vehicle> {
        return this.vehicleRepository.findOne({
            where: { license_plate: license_plate }
        })
    }
    findVehicleById(id_vehicle: number): Promise<Vehicle> {
        return this.vehicleRepository.findOne({
            where: { id_vehicle: id_vehicle }
        })
    }
    saveStatusVehicle(vehicle: Vehicle): Promise<Vehicle> {
        return this.vehicleRepository.save(
            this.vehicleRepository.create(vehicle)
        );
    }

    getListVehicle(): Promise<Vehicle[]> {
        return this.vehicleRepository.find();
    }
}
