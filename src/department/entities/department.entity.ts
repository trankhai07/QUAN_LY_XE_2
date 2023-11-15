import { User } from "src/users/entities/users.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "department" })
export class Department {

    @PrimaryGeneratedColumn()
    id_department: number;

    @Column()
    name_department: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(()=>User, (user)=>user.department)
    users: User[];
}