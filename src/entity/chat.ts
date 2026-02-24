import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat_user } from "./chat_user";
import { Message } from "./message";
import { User } from "./user";

@Entity()
export class Chat{

    @PrimaryGeneratedColumn()
    id!:number

    @Column({
        default:"defaultAva.png"
    })
    ava!:string

    @ManyToOne(()=>User, (user)=>user.chat_host)
    author!:User

    @Column()
    name!:string

    @OneToMany(()=>Chat_user, (user)=>user.chats)
    users!:Chat_user[]

    @OneToMany(() => Message, (messages) => messages.chat)
    messages!:Message[]
}