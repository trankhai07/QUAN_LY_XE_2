import { User } from "src/users/entities/users.entity";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'token' })
export class Token {
    @PrimaryGeneratedColumn()
    id_token: number;


    @Column()
    refreshToken: string;

    @ManyToOne(() => User)
    @Index('id_user')
    user: User;



}