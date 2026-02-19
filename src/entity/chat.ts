import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat_user } from "./chat_user";
import { Message } from "./message";

@Entity()
export class Chat{

    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    name!:string

    @OneToMany(()=>Chat_user, (user)=>user.chats)
    users!:Chat_user[]

    @OneToMany(() => Message, (messages) => messages.chat)
    messages!:Message[]
}