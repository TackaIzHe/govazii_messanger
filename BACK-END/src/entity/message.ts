import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany} from "typeorm";
import { User } from "./user";
import { Chat } from "./chat";
import { Reaction_message } from "./reation_message";

@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    value!:string

    @OneToMany(()=>Reaction_message, (reactions)=>reactions.messages)
    reactions!:Reaction_message[]

    @ManyToOne(() => User, (user) => user.messages)
    user!:User

    @OneToOne(() => Chat, (chat) => chat.messages)
    chat!:Chat
}