import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";


@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    message!:string

    @ManyToOne(()=>User, (user)=>user.reviews_autor)
    author!:User

    @ManyToOne(()=>User, (user)=>user.reviews)
    wall!:User
}