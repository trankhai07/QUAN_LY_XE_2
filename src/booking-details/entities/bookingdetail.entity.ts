import { User } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "bookingdetail" })
export class BookingDetail {
    @PrimaryGeneratedColumn()
    id_booking: number;
    @Column()
    date_start: string;
    @Column()
    date_end: string;
    @Column()
    time_start: string;
    @Column()
    time_end: string;
    @Column()
    location_start: string;
    @Column()
    location_end: string;
    @Column()
    numbers_passenger: number;
    @Column()
    position_title: string;
    @Column()
    fullname_booking: string;
    @Column()
    reason_booking: string;
    @Column()
    area: string;
    @Column()
    status_booking: string;
    @ManyToOne(() => User, (user) => user.booking_drivers)
    @JoinColumn({ name: 'id_driver', referencedColumnName: 'id_user' })
    driver: User;

    @ManyToOne(() => User, (user) => user.bookings)
    @JoinColumn({ name: 'id_person_booking', referencedColumnName: 'id_user' })
    person_booking: User;

}