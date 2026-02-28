import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message";
import { Reaction } from "./reaction";


@Entity()
export class Reaction_message{
    @PrimaryGeneratedColumn()
    id!:number

    @ManyToOne(()=>Message, (message)=>message.reactions)
    messages!:Message

    @ManyToOne(()=>Reaction, (reaction)=> reaction.messages)
    reactions!:Reaction
}