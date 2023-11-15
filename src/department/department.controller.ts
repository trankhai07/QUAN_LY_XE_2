import { Body, Controller, Delete, Get, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentDto } from './dto/department.dto';
import { Department } from './entities/department.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/JwtAuthGuard';
import { RolesGuard } from 'src/auth/guard/RoleGuard';
import { UserRole } from 'src/enum/enum.role';
import { UpdateDepartmentDto } from './dto/updateDepartment.dto';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller({ path: 'departments', version: '2' })
@UseGuards(JwtGuard, new RolesGuard([UserRole.ADMIN]))
export class DepartmentController {
    constructor(private departmentService: DepartmentService) {

    }
    @Get('list')
    getListDepartment() {
        return this.departmentService.getListDepartment();
    }
    @Post('create')
    createDepartment(@Body() data: DepartmentDto): Promise<Department> {
        return this.departmentService.createDepartment(data);
    }
    @Patch('update')
    @ApiQuery({ name: 'id_department', type: 'number', required: true })
    updateDepartment(@Body() update: UpdateDepartmentDto, @Request() req) {
        return this.departmentService.updateDepartment(update, req.query.id_department);
    }
    @Delete('delete')
    @ApiQuery({ name: 'id_department', type: 'number', required: true })
    deleteDepartment(@Request() req) {
        const department = this.departmentService.deleteDepartment(req.query.id_department);
        if (department) return { status: 200, message: 'Successfull' };
    }
}
