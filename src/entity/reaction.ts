import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message";
import { Reaction_message } from "./reation_message";


@Entity()
export class Reaction{
    @PrimaryGeneratedColumn()
    id!:number

    @OneToMany(()=>Reaction_message, (messages)=>messages.reactions)
    messages!:Reaction_message[]

    @Column()
    img!:string
}