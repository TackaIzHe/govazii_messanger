import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Message } from "./message";
import { Role } from "../objects/enams";
import { Chat_user } from "./chat_user";
import { Review } from "./review";
import { Reaction } from "./reaction";
import { Chat } from "./chat";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({
        default: "defaultAva.png"
    })
    ava!:string

    @Column()
    name!:string

    @Column()
    email!:string

    @Column()
    password!:string

    @Column({
        default:Role.user
    })
    role!:string

    @OneToMany(()=>Chat, (chats)=>chats.author)
    chat_host!:Chat[]

    @OneToMany(()=>Chat_user, (chat)=>chat.users)
    chats!:Chat_user[]

    @OneToMany(() => Message, (message) => message.user)
    messages!:Message[]

    @OneToMany(()=>Review, (review)=>review.author)
    reviews_autor!:Review[]

    @OneToMany(()=>Review, (review)=>review.wall)
    reviews!:Review[]

    @OneToMany(()=>Reaction, (reaction)=>reaction.author)
    reaction_author!: Reaction[]

}