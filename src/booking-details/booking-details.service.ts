import { IsEmpty } from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingDetail } from './entities/bookingdetail.entity';
import { LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { BookingDetailDto } from './dto/bookingdetails.dto';
import { UsersService } from 'src/users/users.service';
import { ReasonService } from 'src/reason/reason.service';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/enum/enum.role';
import { ReasonP2 } from 'src/reason/dto/reasonP2.dto';
import { DayMonthYear } from './dto/DayMonthYear.dto';
import { format } from 'date-fns';

@Injectable()
export class BookingDetailsService {
    constructor(@InjectRepository(BookingDetail)
    private bookingRepository: Repository<BookingDetail>,
        private userService: UsersService,
        private reasonService: ReasonService) {

    }

    // Tạo booking detail của phòng ban
    async createBookingDetail(id_person_booking: number, id_driver: number, data: BookingDetailDto): Promise<BookingDetailDto> {

        const person_booking = await this.userService.findUserByIdUser(id_person_booking);
        const driver = await this.userService.findUserByIdUser(id_driver);

        if (driver.vehicle.seats < data.numbers_passenger) throw new BadRequestException("Không đủ chỗ ngồi chỉ có khả năng chứa " + driver.vehicle.seats + " người");
        // tìm booking cũ
        const bookingOld = await this.findBookingDetailByDriverDesc(driver);

        const status_booking: string = 'Chờ duyệt';

        const date_start = new Date(data.date_start);
        const date_end = new Date(data.date_end);

        const timePartsStart = data.time_start.split(':'); // Tách chuỗi time_start thành các phần giờ và phút
        date_start.setHours(Number(timePartsStart[0])); // Đặt giờ từ phần tử đầu tiên trong timePartsStart
        date_start.setMinutes(Number(timePartsStart[1])); // Đặt phút từ phần tử thứ hai trong timePartsStart

        const timePartsEnd = data.time_end.split(':'); // Tách chuỗi time_start thành các phần giờ và phút
        date_end.setHours(Number(timePartsEnd[0])); // Đặt giờ từ phần tử đầu tiên trong timePartsEnd
        date_end.setMinutes(Number(timePartsEnd[1])); // Đặt phút từ phần tử thứ hai trong timePartsEnd

        const timeStartConvert: number = date_start.getTime();
        const timeEndConvert: number = date_end.getTime();

        if (timeEndConvert <= timeStartConvert) throw new BadRequestException("Thời gian về phải lớn hơn và khác thời gian bắt đầu");


        // kiểm tra xem thời gian đặt xe tiếp theo của phòng ban có trong khoảng thời gian xe trc đó không
        if (bookingOld.length !== 0 && bookingOld) {

            const timePartsOldEnd = bookingOld[0].time_end.split(':'); // Tách chuỗi time_start thành các phần giờ và phút
            const dateOldEnd = new Date(bookingOld[0].date_end);
            dateOldEnd.setHours(Number(timePartsOldEnd[0])); // Đặt giờ từ phần tử đầu tiên trong timePartsEnd
            dateOldEnd.setMinutes(Number(timePartsOldEnd[1])); // Đặt phút từ phần tử thứ hai trong timePartsEnd

            const timeEndOldConvert: number = dateOldEnd.getTime();
            if (timeEndOldConvert >= timeStartConvert &&
                (bookingOld[0].status_booking === 'Đã duyệt' ||
                    bookingOld[0].status_booking === 'Trong chuyến' ||
                    bookingOld[0].status_booking === 'Chờ duyệt')) {
                throw new BadRequestException('Thời gian đặt phải khác thời gian dự kiến đến ' + new Date(timeEndOldConvert));
            }
        }
        const booking_details = await this.bookingRepository.save(
            this.bookingRepository.create({ ...data, status_booking, driver, person_booking })
        );
        const reason = await this.reasonService.createReason(booking_details);

        return booking_details;
    }
    async findBookingDetailByDriverDesc(driver: User): Promise<BookingDetail[]> {
        return this.bookingRepository.find({
            where: { driver: driver },
            order: { date_end: 'DESC' },
        });
    }

    async findBookingDetailById(id_booking: number) {
        return this.bookingRepository.findOne({
            where: { id_booking: id_booking }
        });
    }
    // lấy danh sách đang chờ duyệt của đặt xe đang chờ duyệt của nội thành và ngoại thành
    async getListPendingBooking(role: string): Promise<BookingDetail[]> {
        if (role === UserRole.HCNS) {
            return this.bookingRepository.find({
                where: { status_booking: 'Chờ duyệt', area: 'Nội Thành' },
                relations: ['driver', 'person_booking', 'driver.vehicle']
            })
        } else if (role === UserRole.BGD) {
            return this.bookingRepository.find({
                where: { status_booking: 'Chờ duyệt', area: 'Ngoại Thành' },
                relations: ['driver', 'person_booking', 'driver.vehicle']
            })
        }
    }

    // lấy danh sách đang chờ duyệt từ phòng ban
    async getWaitAccess(id_person_booking: number): Promise<BookingDetail[]> {
        const person_booking = await this.userService.findUserByIdUser(id_person_booking);
        return this.bookingRepository.find(
            {
                where: { person_booking: person_booking },
                relations: ['driver']
            }
        );
    }

    // lấy danh sách yêu cầu đặt xe đã duyệt của HCNS, BGD
    async getListAccessBooking(role: string): Promise<BookingDetail[]> {
        if (role === UserRole.HCNS) {
            return this.bookingRepository.find({
                where: { status_booking: 'Đã duyệt', area: 'Nội Thành' },
                relations: ['driver', 'person_booking', 'driver.vehicle'],
                order: {
                    date_start: 'ASC'
                }
            })
        } else if (role === UserRole.BGD) {
            return this.bookingRepository.find({
                where: { status_booking: 'Đã duyệt', area: 'Ngoại Thành' },
                relations: ['driver', 'person_booking', 'driver.vehicle'],
                order: {
                    date_start: 'ASC'
                }
            })
        }
    }

    //lấy danh sách yêu cầu đặt xe đã duyệt của HCNS, BGD theo trong khoảng thời gian
    async getListAccessBookingByDate(daymonthyear: DayMonthYear, role: string) {


        if (role === UserRole.HCNS) {
            return this.bookingRepository.find({
                where: {
                    status_booking: 'Đã duyệt', area: 'Nội Thành',
                    date_start: MoreThanOrEqual(daymonthyear.date_start),
                    date_end: LessThanOrEqual(daymonthyear.date_end)
                },
                relations: ['driver', 'person_booking', 'driver.vehicle'],
                order: {
                    date_start: 'ASC'
                }
            })
        } else if (role === UserRole.BGD) {
            return this.bookingRepository.find({
                where: {
                    status_booking: 'Đã duyệt', area: 'Ngoại Thành',
                    date_start: MoreThanOrEqual(daymonthyear.date_start),
                    date_end: LessThanOrEqual(daymonthyear.date_end)
                },
                relations: ['driver', 'person_booking', 'driver.vehicle'],
                order: {
                    date_start: 'ASC'
                }
            })
        }
    }


    // lấy danh sách PB đang chờ duyệt của việc hủy xe 
    async getListPendingCancel(role: string): Promise<any> {
        if (role === UserRole.HCNS) {
            return this.reasonService.getListPendingCancel('Nội Thành')
        } else if (role === UserRole.BGD) {
            return this.reasonService.getListPendingCancel('Ngoại Thành')
        }
    }

    // lấy danh sách của đặt xe của tài xế 
    async getListAccessed(id_driver: number) {
        const driver = await this.userService.findUserByIdUser(id_driver);
        return this.bookingRepository.find({
            where: { driver: driver, status_booking: 'Đã duyệt' },
            order: {
                date_start: 'ASC'
            }
        });

    }


    // hàm đồng ý duyệt của HCNS và BGD
    async accessBookingDetail(id_booking: number): Promise<BookingDetail> {
        const bookingDetail = await this.findBookingDetailById(id_booking);
        // khi có lý do thì quản lý đồng ý muốn hủy đơn của đã duyệt
        if (bookingDetail.status_booking === 'Đã duyệt') bookingDetail.status_booking = 'Hủy';

        // khi không có lý do là quản lý đang đồng ý duyệt đơn đặt
        else if (bookingDetail.status_booking === 'Chờ duyệt') bookingDetail.status_booking = 'Đã duyệt';

        return this.bookingRepository.save(
            this.bookingRepository.create(bookingDetail)
        );
    }


    // hàm hủy booking của phòng ban, hcns, bgd
    async deleteBookingDetail(id_booking: number, role: string, reason_cancel?: ReasonP2) {

        const bookingDetail = await this.findBookingDetailById(id_booking);
        // hủy khi chưa duyệt thì không cần lý do
        if (bookingDetail.status_booking === 'Chờ duyệt') {
            if ((role === UserRole.HCNS || role === UserRole.BGD) && !reason_cancel.reasonP2) throw new BadRequestException('Bạn cần nhập lý do hủy');
            else {
                const reason = await this.reasonService.findReasonByBooking(bookingDetail);
                reason.reason_cancel_reviewer = reason_cancel.reasonP2;
                const result = await this.reasonService.saveReason(reason);
                if (!result) throw new BadRequestException('Lưu không thành công');
            }
            bookingDetail.status_booking = 'Hủy';
            return this.bookingRepository.save(
                this.bookingRepository.create(bookingDetail)
            );
        }

        // phòng ban hủy khi đã duyệt, HCNS hoặc BGD hủy không đồng ý hủy của PB
        else if (bookingDetail.status_booking === 'Đã duyệt') {
            console.log(reason_cancel.reasonP2)
            if (!reason_cancel.reasonP2 || Object.entries(reason_cancel).length === 0) throw new BadRequestException('Bạn cần đưa ra lý do hủy');

            const reason = await this.reasonService.findReasonByBooking(bookingDetail);
            if (role === UserRole.PB) {
                reason.reason_cancel_department = reason_cancel.reasonP2;
            }
            else if (role === UserRole.HCNS || role === UserRole.BGD) {
                reason.reason_cancel_reviewer = reason_cancel.reasonP2;
            }
            const result = await this.reasonService.saveReason(reason);
            if (!result) throw new BadRequestException('Lưu không thành công');
            return bookingDetail;
        }
    }

    // hàm trong chuyến đi của tài xế
    async inTheTrip(id_booking: number): Promise<BookingDetail> {
        const bookingDetail = await this.findBookingDetailById(id_booking);

        if (bookingDetail.status_booking === 'Đã duyệt')
            bookingDetail.status_booking = 'Trong chuyến';
        else if (bookingDetail.status_booking === 'Trong chuyến')
            bookingDetail.status_booking = 'Hoàn thành';

        return this.bookingRepository.save(
            this.bookingRepository.create(bookingDetail)
        );
    }


}
