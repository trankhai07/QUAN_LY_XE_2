import { Exclude } from "class-transformer";
import { BookingDetail } from "src/booking-details/entities/bookingdetail.entity";
import { Department } from "src/department/entities/department.entity";
import { Vehicle } from "src/vehicles/entities/vehicles.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column({ unique: true })
    id_employee: string;

    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    fullname: string;

    @Column({ nullable: true })
    avatar: string;

    @Column()
    role: string;

    @ManyToOne(() => Department, (depart) => depart.users)
    @JoinColumn({ name: 'id_department', referencedColumnName: 'id_department' })
    department: Department;

    @OneToOne(() => Vehicle)
    @JoinColumn({ name: 'id_vehicle', referencedColumnName: 'id_vehicle' })
    vehicle: Vehicle;

    // cho người đặt
    @OneToMany(() => BookingDetail, (bookingdetail) => bookingdetail.person_booking)
    bookings: BookingDetail[];

    // cho người được đặt
    @OneToMany(() => BookingDetail, (bookingdetail) => bookingdetail.driver)
    booking_drivers: BookingDetail[];

}