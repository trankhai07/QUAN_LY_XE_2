import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reason } from './entities/reason.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { BookingDetail } from 'src/booking-details/entities/bookingdetail.entity';

@Injectable()
export class ReasonService {
    constructor(@InjectRepository(Reason)
    private reasonRepository: Repository<Reason>) {

    }
    createReason(booking: BookingDetail): Promise<Reason> {
        const time_booking_department = new Date();
        return this.reasonRepository.save(
            this.reasonRepository.create({ time_booking_department, booking })
        );
    }

    findReasonByBooking(booking: BookingDetail): Promise<Reason> {
        return this.reasonRepository.findOne({
            where: { booking: booking }
        })
    }

    saveReason(reason: Reason): Promise<Reason> {
        return this.reasonRepository.save(
            this.reasonRepository.create(reason)
        );
    }

    // lấy danh sách PB đang chờ duyệt của việc hủy xe 
    getListPendingCancel(area: string): Promise<Reason[]> {
        // tìm những đơn đợi duyệt hủy khi đã duyệt dựa vào lý do 
        return this.reasonRepository.find(
            {
                where: {
                    reason_cancel_department: Not(IsNull()),  // điều kiện khi có lý do tức là muốn hủy
                    reason_cancel_reviewer: IsNull(), // để loại bỏ những đơn mà quản lý đã hủy do có lý do 
                    booking: {
                        status_booking: 'Đã duyệt', // đơn cần là đã duyệt 
                        area: area    // khu vực 
                    }
                },
                relations: ['booking']
            }
        );
    }

}
