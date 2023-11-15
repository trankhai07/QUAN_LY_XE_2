import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { DepartmentDto } from './dto/department.dto';
import { UpdateDepartmentDto } from './dto/updateDepartment.dto';

@Injectable()
export class DepartmentService {
    constructor(@InjectRepository(Department) private departmentRepository: Repository<Department>) {

    }

    createDepartment(data: DepartmentDto): Promise<Department> {
        return this.departmentRepository.save(
            this.departmentRepository.create(data)
        );
    }
    async updateDepartment(updateDepartment: UpdateDepartmentDto, id_department: number): Promise<Department> {
        const deparment = await this.findDepartmentById(id_department);
        deparment.description = updateDepartment.description;
        return this.departmentRepository.save(
            this.departmentRepository.create(deparment)
        );
    }

    async deleteDepartment(id_department: number): Promise<Department> {
        const department = await this.findDepartmentById(id_department);
        return this.departmentRepository.remove(department);
    }

    getListDepartment(): Promise<Department[]> {
        return this.departmentRepository.find();
    }

    findDepartmentByname(name_department: string): Promise<Department> {
        return this.departmentRepository.findOne({
            where: { name_department: name_department }
        })
    }

    findDepartmentById(id_department: number): Promise<Department> {
        return this.departmentRepository.findOne({
            where: { id_department: id_department }
        })
    }
}
