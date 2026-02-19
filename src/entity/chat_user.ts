import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Chat } from "./chat";

@Entity()
export class Chat_user{
    @PrimaryGeneratedColumn()
    id!:number

    @ManyToOne(()=>User, (user)=>user.chats)
    users!:User

    @ManyToOne(()=>Chat, (chats)=> chats.users)
    chats!:Chat
}