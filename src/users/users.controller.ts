import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors, UsePipes, ValidationPipe, Request, UseGuards, Res, Patch, Get, UploadedFile, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guard/JwtAuthGuard';
import { LocalAuthGuard } from 'src/auth/guard/LocalAuthGuard';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/updatepassword.dto';
import { UpdateInfor } from './dto/updateInfor.dto';
import { RolesGuard } from 'src/auth/guard/RoleGuard';
import { UserRole } from 'src/enum/enum.role';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/helpers/image-storage';
import { BookingDetailsService } from 'src/booking-details/booking-details.service';
import { MailDto } from 'src/mail/dto/mail.dto';
import { ApiQuery, ApiTags, ApiBody, ApiProperty, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller({ path: 'users', version: '2' })

export class UsersController {
    constructor(private authService: AuthService,
        private userService: UsersService,
        private bookingService: BookingDetailsService) {

    }

    // đăng nhập ứng dụng
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    example: '0945854409',
                },
                password: {
                    type: 'string',
                    example: '123456',
                },
            },
        },
    })
    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    // thoát ứng dụng
    @Post('logout')
    @UseGuards(JwtGuard)
    async logout(@Request() req, @Res() res: Response) {
        const user = await this.userService.logoutUser(req.user);
        if (user) res.status(200).json({ status: 200, message: 'Đăng xuất thành công' });
    }

    // cập nhật mật khẩu của user
    @Patch('updatePassword')
    @UseGuards(JwtGuard)
    async updatePassword(@Body() data: UpdatePasswordDto, @Request() req, @Res() res: Response) {
        console.log(data.passwordNew);
        const updatePassword = await this.userService.updatePasswordUser(data, req.user.username);

        return res.status(200).json({ status: 200, message: 'Thay đổi mật khẩu thành công' });
    }

    // lấy lên đủ thông tin một user dựa id_user
    @Get('')
    @ApiQuery({ name: 'id', type: 'number', required: true })
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, new RolesGuard([UserRole.PB]))
    getUser(@Request() req) {
        return this.userService.findUserByIdUser(req.query.id);
    }

    // lấy lên danh sách tài xế
    @Get('listUser')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, new RolesGuard([UserRole.PB]))
    getListUser() {
        return this.userService.findListUserByVehicle();
    }


    // cập nhật thông tin fullname và avatar
    @Patch('updateInfor')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard)
    async updateInfor(@Body() data: UpdateInfor, @Request() req) {
        try {
            const updateInfor = await this.userService.updateInfor(data, req.user.username);
            // console.log(updateInfor);
            return updateInfor;
            //  return res.status(200).json({ status: 200, message: 'Thay đổi thông tin thành công',data: updateInfor });

        } catch (error) {
            throw new BadRequestException("Cập nhập thông tin lỗi")
        }

        //  return res.status(200).json({ status: 200, message: 'Thay đổi thông tin thành công' });
        //  return updateInfor;
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Patch('uploadAvatar')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
    async UpdateAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {

        console.log(file.originalname);

        if (req.fileValiationError) {
            throw new BadRequestException(req.fileValiationError);
        }
        if (file) {  // vì người dùng có thể chỉ muốn cập nhật thông tin, ảnh vẫn để trống

            return await this.userService.updateAvatar(file.originalname, file.buffer, req.user.username);  // lấy tên file 


        }

    }

    // test ảnh 
    @Get('avatar')
    async getAvatar(@Request() req, @Res() res: Response) {
        const user = await this.userService.findUserByIdUser(req.query.id);
        // return res.
        return user;
    }

    // trạng thái tài xế
    @Post('statusVehicle')
    @UseGuards(JwtGuard, new RolesGuard([UserRole.TX]))
    async updateStatusOff(@Res() res: Response, @Request() req) {
        const updateStatus = await this.userService.updateStatusOnOff(req.user.username, req.query.status);
        console.log(updateStatus);
        if (updateStatus.vehicle.status_vehicle === 'Bận')
            return res.status(200).json({ status: 200, message: 'Trạng thái bận' });
        else if (updateStatus.vehicle.status_vehicle === 'Sẵn sàng')
            return res.status(200).json({ status: 200, message: 'Trạng thái sẵn sàng' });
    }

    @Post('email')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard)
    sendMail(@Body() email: MailDto, @Request() req) {
        try {
            this.userService.forgotPassword(email, req.user.username);
            return { message: `Mật khẩu đã được gửi vui lòng check Email: ${email.email}` };
        } catch (error) {
            throw new BadRequestException('Lỗi gửi mail, vui lòng thử lại');
        }

    }

}
