import { BookingDetail } from "src/booking-details/entities/bookingdetail.entity";
import { User } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "reason" })
export class Reason {
    @PrimaryGeneratedColumn()
    id_reason: number;

    @Column({ nullable: true })
    reason_cancel_department: string;

    @Column({ nullable: true })
    time_cancel: Date;

    @Column()
    time_booking_department: Date;

    @Column({ nullable: true })
    reason_cancel_reviewer: string;

    @Column({ nullable: true })
    time_cancel_reviwer: Date;

    @Column({ nullable: true })
    time_booking_reviewer: Date;

    @OneToOne(() => BookingDetail)
    @JoinColumn({ name: 'id_booking', referencedColumnName: 'id_booking' })
    booking: BookingDetail;

    @Column({ nullable: true, name:'id_reviewer' })
    id_reviewr: number;

}