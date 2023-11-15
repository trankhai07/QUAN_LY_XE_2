import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { UserDto } from './dto/users.dto';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { DepartmentService } from 'src/department/department.service';
import { Vehicle } from 'src/vehicles/entities/vehicles.entity';
import { comparePassword, encodePassword } from 'src/utils/bycrypt';
import { TypeDepartment } from 'src/enum/enum.department';
import { TokenService } from 'src/token/token.service';
import { UpdatePasswordDto } from './dto/updatepassword.dto';

import { UpdateInfor } from './dto/updateInfor.dto';
import { UserRole } from 'src/enum/enum.role';
import { join } from 'path';
import { removeFile } from 'src/helpers/image-storage';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { MailDto } from 'src/mail/dto/mail.dto';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class UsersService {
    // aws s3 
    private readonly s3Client = new S3Client({
        region: this.configService.get('file.awsS3Region', { infer: true }),
        credentials: {
            secretAccessKey: this.configService.get('file.secretAccessKey', { infer: true }),
            accessKeyId: this.configService.get('file.accessKeyId', { infer: true })
        }
    })

    constructor(@InjectRepository(User)
    private userRepository: Repository<User>,
        private vehicelService: VehiclesService,
        private departmentService: DepartmentService,
        private tokenService: TokenService,
        private vehicleService: VehiclesService,
        private configService: ConfigService<AllConfigType>,
        private mailService: MailerService) {

    }


    findUserByUsername(username: string): Promise<User> {
        return this.userRepository.findOne(
            {
                where: { username: username },
                relations: ['department', 'vehicle']
            }
        );
    }
    findUserByVehicle(vehicle: Vehicle): Promise<User> {
        return this.userRepository.findOne({
            where: { vehicle: vehicle }
        });
    }
    findUserByIdEmployee(id: string): Promise<User> {
        return this.userRepository.findOne(
            {
                where: { id_employee: id }
            }
        );
    }
    findUserByIdUser(id: number): Promise<User> {
        return this.userRepository.findOne(
            {
                where: { id_user: id },
                relations: ['vehicle']
            }
        );
    }


    findListUserByVehicle(): Promise<User[]> {
        return this.userRepository.find({
            where: { vehicle: Not(IsNull()) },
            relations: ['vehicle']
        });
    }

    async createUser(data: UserDto): Promise<User> {

        // hash password
        data.password = encodePassword(data.password);
        // dùng kiểm tra username tồn tại chưa khi đăng ký
        const username = await this.findUserByUsername(data.username);
        const id_employee = await this.findUserByIdEmployee(data.id_employee);
        if (username) throw new BadRequestException('Username đã tồn tại');
        if (id_employee) throw new BadRequestException('Mã nhân viên đã tồn tại');
        // dùng để tìm xem mã phòng có tồn tại hay không 
        const department = await this.departmentService.findDepartmentByname(data.name_department);

        if (department) {

            // Thêm role 
            for (const key in TypeDepartment) {
                if (data.name_department === TypeDepartment[key]) {
                    data.role = UserRole[key];
                    break;
                }
            }
            // nếu tài khoản là tài xế thì đăng ký thêm xe 
            if (data.name_department === TypeDepartment.TX) {
                // kiểm tra xem nhập đủ thông tin xe chưa
                if (data.license_plate == null || data.type_vehicle == null) {
                    throw new BadRequestException('Vui lòng nhập đủ thông tin xe');
                } else {

                    // tìm xe theo mã biển 
                    const vehicle = await this.vehicelService.findVehicleByLicense(data.license_plate);

                    // tìm xem có xe nào đã được bàn giao cho tài xế chưa
                    const user = await this.findUserByVehicle(vehicle);

                    // kiểm tra 2 điều kiện không thì sẽ lấy cả những role không có xe ( vì nếu vehicle không tồn tại thì null)
                    if (user && vehicle) throw new BadRequestException('Xe đã được bàn giao cho tài xế khác');

                    if (!vehicle) throw new BadRequestException('Xe không tồn tại');
                    else {
                        return this.userRepository.save(
                            this.userRepository.create({ ...data, department, vehicle })
                        );
                    }
                }
            }
            else
                return this.userRepository.save(
                    this.userRepository.create({ ...data, department })
                );
        }
        else throw new BadRequestException('Phòng không tồn tại');

    }

    async logoutUser(payload: any) {
        const user = await this.userRepository.findOne({
            where: { id_user: payload.id.id_user }
        })
        const deleteToken = await this.tokenService.deleteToken(user);
        if (deleteToken) return user;
        throw new BadRequestException('Thoát không thành công');
    }

    async updatePasswordUser(updatePassword: UpdatePasswordDto, username: string): Promise<User> {
        const user = await this.findUserByUsername(username);
        const match = comparePassword(updatePassword.passwordOld, user.password);
        if (!match) throw new BadRequestException('Mật khẩu cũ không đúng');
        user.password = encodePassword(updatePassword.passwordNew);

        return this.userRepository.save(
            this.userRepository.create(user)
        );
    }

    async updateInfor(updateInfor: UpdateInfor, username: string): Promise<User> {

        const user = await this.findUserByUsername(username);

        user.fullname = updateInfor.fullname;
        return this.userRepository.save(
            this.userRepository.create(user)
        );
    }

    // asw s3
    async updateAvatar(avatar: string, file: Buffer, username: string): Promise<User> {

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.configService.get('file.awsDefaultS3Bucket', { infer: true }),
                    Key: avatar,
                    Body: file,
                    ContentType: "image/jpg, image/png, image/jpeg,image/webp",
                    ACL: 'public-read'
                }),
            );
            const user = await this.findUserByUsername(username);
            // set vào database
            user.avatar = `https://${this.configService.get('file.awsDefaultS3Bucket', { infer: true })}.s3.${this.configService.get('file.awsS3Region', { infer: true })}.amazonaws.com/${avatar}`;
            return this.userRepository.save(
                this.userRepository.create(user)
            );
        } catch (error) {
            throw new BadRequestException('Lưu lỗi');
        }

    }

    // update trạng thái tài xế
    async updateStatusOnOff(username: string, check: string): Promise<User> {
        const user = await this.findUserByUsername(username);
        // tìm xe và lưu trạng thái xe xuống db
        const vehicle = await this.vehicelService.findVehicleByLicense(user.vehicle.license_plate);
        if (check === 'Off')
            vehicle.status_vehicle = 'Bận';
        else if (check === 'On')
            vehicle.status_vehicle = 'Sẵn sàng';
        const vehicle_status = await this.vehicelService.saveStatusVehicle(vehicle);

        // set lại xe cho user
        user.vehicle = vehicle_status;

        return this.userRepository.save(
            this.userRepository.create(user)
        );
    }

    async generateRandomNumber(): Promise<number> {
        const min = 100000; // Giá trị nhỏ nhất có 6 chữ số
        const max = 999999; // Giá trị lớn nhất có 6 chữ số
        return await Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async forgotPassword(mail: MailDto, username: string) {
        const user = await this.findUserByUsername(username);
        const passwordRandom = (await (this.generateRandomNumber())).toString();
        user.password = encodePassword(passwordRandom);
        this.userRepository.save(
            this.userRepository.create(user)
        );
        await this.mailService.sendMail({
            to: mail.email,
            subject: 'SRS_QUAN_LY_XE',
            template: './forgotPassword',
            context: {
                name: user.fullname,
                password: passwordRandom
            }
        })
    }
}
