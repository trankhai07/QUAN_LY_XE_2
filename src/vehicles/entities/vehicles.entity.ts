import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'vehicle' })
export class Vehicle {

    @PrimaryGeneratedColumn()
    id_vehicle: number;

    @Column()
    type: string;

    @Column({ unique: true })
    license_plate: string;

    @Column()
    seats: number;

    @Column({ nullable: true })
    status_vehicle: string;
}