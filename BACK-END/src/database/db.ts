import { DataSource } from "typeorm";
import { User } from "../entity/user";
import { Message } from "../entity/message";
import { Chat } from "../entity/chat";
import { Chat_user } from "../entity/chat_user";
import { Reaction } from "../entity/reaction";
import { Reaction_message } from "../entity/reation_message";
import { Review } from "../entity/review";

export const DbContext = new DataSource({
    type:'sqlite',
    database:'db.sqlite',
    synchronize: true,
    // logging:true,
    entities:[
        User,
        Message,
        Chat,
        Chat_user,
        Reaction,
        Reaction_message,
        Review
    ]
})