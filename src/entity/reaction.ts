import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reaction_message } from "./reation_message";
import { User } from "./user";


@Entity()
export class Reaction{
    @PrimaryGeneratedColumn()
    id!:number

    @OneToMany(()=>Reaction_message, (messages)=>messages.reactions)
    messages!:Reaction_message[]

    @Column()
    img!:string

    @ManyToOne(()=>User, (user)=>user.reaction_author)
    author!:User
}