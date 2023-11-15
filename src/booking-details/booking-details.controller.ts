import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe, Request, BadRequestException, ClassSerializerInterceptor, UseInterceptors, Patch } from '@nestjs/common';
import { BookingDetailDto } from './dto/bookingdetails.dto';
import { JwtGuard } from 'src/auth/guard/JwtAuthGuard';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetail } from './entities/bookingdetail.entity';
import { RolesGuard } from 'src/auth/guard/RoleGuard';
import { UserRole } from 'src/enum/enum.role';
import { ReasonP2 } from 'src/reason/dto/reasonP2.dto';
import { DayMonthYear } from './dto/DayMonthYear.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller({ path: 'booking-details', version: '2' })
export class BookingDetailsController {
    // @Get('')
    // @UsePipes(new ValidationPipe())
    // getBookingdetail(@Body() data: BookingDetailDto){
    //     console.log(data);
    // }

    constructor(private bookingService: BookingDetailsService) {

    }

    // tạo booking của phòng ban
    @ApiQuery({ name: 'id_driver', type: 'number', required: true })
    @Post('create')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard)
    createBooking(@Body() data: BookingDetailDto, @Request() req): Promise<BookingDetailDto> {
        try {
            return this.bookingService.createBookingDetail(req.user.id.id_user, req.query.id_driver, data);
        } catch (error) {
            throw new BadRequestException('Đặt xe thất bại do lỗi hệ thống');
        }

    }
    // Lấy danh sách đang chờ duyệt của nội thành 
    @ApiOperation({ summary: 'Danh sách chờ duyệt trong thành phố role(HCNS)' })
    @Get('list/incity')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, new RolesGuard([UserRole.HCNS]))
    getListInnerCity(): Promise<BookingDetail[]> {
        return this.bookingService.getListPendingBooking(UserRole.HCNS)
    }

    // Lấy danh sách đang chờ duyệt của ngoai thành 
    @ApiOperation({ summary: 'Danh sách chờ duyệt ngoài thành phố role(BGD)' })
    @Get('list/outcity')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, new RolesGuard([UserRole.BGD]))
    getListSuburban(): Promise<BookingDetail[]> {
        return this.bookingService.getListPendingBooking(UserRole.BGD)
    }

    // lấy danh sách đang chờ duyệt hủy của đặt xe đã duyệt
    @ApiOperation({ summary: 'Danh sách đang chờ duyệt hủy của đặt xe đã duyệt role(HCNS,BGD)' })
    @Get('list/cancelBooking')
    @UseGuards(JwtGuard, new RolesGuard([UserRole.HCNS, UserRole.BGD]))

    getListCancelBooking(@Request() req) {
        return this.bookingService.getListPendingCancel(req.user.role);
    }

    // lấy danh sách yêu cầu đặt xe đã duyệt của HCNS, BGD
    @ApiOperation({ summary: 'Danh sách yêu cầu đặt xe đã duyệt của HCNS, BGD' })
    @Get('list/accessBooking')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, new RolesGuard([UserRole.HCNS, UserRole.BGD]))

    getListAccessBooking(@Request() req) {
        return this.bookingService.getListAccessBooking(req.user.role);
    }

    // lấy danh sách yêu cầu đặt xe đã duyệt của HCNS, BGD trong khoảng thời gian
    @ApiOperation({ summary: 'Danh sách yêu cầu đặt xe đã duyệt của HCNS, BGD trong khoảng thời gian role(HCNS,BGD)' })
    @Get('list/accessBooking/date')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, new RolesGuard([UserRole.HCNS, UserRole.BGD]))

    getListAccessBookingDate(@Request() req, @Body() data: DayMonthYear) {
        return this.bookingService.getListAccessBookingByDate(data, req.user.role);
    }

    // duyệt bookingdetail 
    @ApiOperation({ summary: 'Duyệt bookingdetail role(HCNS,BGD)' })
    @ApiQuery({ name: 'id_booking', type: 'number', required: true })
    @Patch('updateAccess')
    @UseGuards(JwtGuard, new RolesGuard([UserRole.BGD, UserRole.HCNS]))

    accessBooking(@Request() req) {
        return this.bookingService.accessBookingDetail(req.query.id_booking);
    }

    // hàm hủy của phòng ban và HCNS, BGD
    @ApiOperation({ summary: 'Huỷ bookingdetail của HCNS, BGD role(PB,HCNS,BGD)' })
    @ApiQuery({ name: 'id_booking', type: 'number', required: true })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                reasonP2: {
                    type: 'string',
                    example: 'Tôi muốn huỷ',
                }
            },
        },
    })
    @Patch('updateCancel')
    @UseGuards(JwtGuard)
    cancelBooking(@Request() req, @Body() reason: ReasonP2 | null): Promise<BookingDetail> {
        try {
            return this.bookingService.deleteBookingDetail(req.query.id_booking, req.user.role, reason);
        } catch (error) {
            throw new BadRequestException('Lỗi hệ thống');
        }

    }

    // hàm trạng thái bookingDetail trong chuyến và hoàn thành
    @ApiOperation({ summary: 'Trạng thái bookingDetail trong chuyến và hoàn thành role(TX)' })
    @ApiQuery({ name: 'id_booking', type: 'number', required: true })
    @Patch('updateStartEnd')
    @UseGuards(JwtGuard, new RolesGuard([UserRole.TX]))

    startendBooking(@Request() req): Promise<BookingDetail> {
        try {
            return this.bookingService.inTheTrip(req.query.id_booking);
        } catch (error) {
            throw new BadRequestException('Lỗi hệ thống');
        }

    }

    // lấy danh sách đang chờ duyệt từ phòng ban
    @ApiOperation({ summary: 'Danh sách đang chờ duyệt Bookingdetails từ phòng ban role(PB)' })
    @Get('listWaitAccess')
    @UseGuards(JwtGuard, new RolesGuard([UserRole.PB]))
    getWaitAccess(@Request() req) {
        console.log(req.user);
        return this.bookingService.getWaitAccess(req.user.id.id_user);
    }

}
