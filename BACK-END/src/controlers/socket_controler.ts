/// <reference path="../types/httpExtend.d.ts" />
import { Cookie_info } from "../objects/jwt_payload";
import { User_s_info } from "../objects/socket_obj"
import https from "https"
import http from "http"
import {Server, Socket} from "socket.io"
import { verify_jwt } from "../middleware/create_jwt";
import setCookieParser from "../middleware/socket_io_cookie_parser";
import { DbContext } from "../database/db";
import { User } from "../entity/user";
import { Chat } from "../entity/chat";
import {MSG, EEventString, EMsgType} from "../../../Heders/interfaces"
import { Message } from "../entity/message";

enum EErrorMsg {
    NotFound = "Error 404",
    AccessDenie = "Access Error"
}

export class Socket_controler {
    static async setSocket(server: https.Server | http.Server) {
        try {
            const frontEndProto = process.env.FRONT_PROTO || "http"
            const frontEndHost = process.env.FRONT_HOST || "localhost"
            const frontEndPort = process.env.FRONT_PORT || 45000
            
            const io = new Server(server,
                {
                    cookie: true,
                    cors:
                    {
                        origin: `${frontEndProto}://${frontEndHost}:${frontEndPort}`,
                        credentials: true
                    }
                })

            setCookieParser(io);
            io.on('connection', (socket) => {
                const req = socket.request;
                if (!req.cookies)
                    return;
                
                const {Session} = req.cookies;
                this.addOnlineUser(socket.id, Session)
                this.connectToRooms(socket)
                
                socket.on("disconnect", () => {
                    this.delOnlineUser(socket.id, Session)
                })
                this.socketEvents(socket)
            })
        }
        catch (e) {

        }
    }
    static async addOnlineUser(id: string, cookie: string|undefined) {
        try {
            if (typeof cookie == "undefined")
                return;
            const token = verify_jwt(cookie)
            if (typeof token == "undefined")
                return;
            const parseCookie: Cookie_info = token;
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:parseCookie.id}})

            if (!findUser)
                return
            findUser.isOnline = true
            findUser.socketId = id;
            await userRepo.save(findUser);
            // onlineUser.add({ id: id, cookie: parseCookie })
        }
        catch (e) {
            console.log(e)
        }
    }
    static async delOnlineUser(id: string, cookie: string|undefined) {
        try {
            if (typeof cookie == "undefined")
                return;
            const token = verify_jwt(cookie)
            if (typeof token == "undefined")
                return;
            const parseCookie: Cookie_info = token;
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:parseCookie.id}})

            if (!findUser)
                return
            findUser.socketId = "";
            findUser.isOnline = false;
            await userRepo.save(findUser)
            // onlineUser.forEach((x)=>{
            //     if (x.id == id)
            //         onlineUser.delete(x);
            // })
        }
        catch (e) {
            console.log(e)
        }
    }
    static async socketEvents(socket:Socket) {
        try {
            let mess: string = ""
            socket.on("chat message", (msg_type:EEventString, msg: MSG)=>{
                switch (msg_type) {
                    case EEventString.ESendMess:
                        this.sendMessageForGroup(socket, msg);
                        break;
                    case EEventString.EWriteMess:
                        mess = ""
                        break;
                    case EEventString.EEndWriteMess:
                        mess = ""
                        break;
                    case EEventString.EOnlineUser:
                        mess = ""                        
                        break;
                    case EEventString.EReadMess:
                        mess = ""
                        break;
                
                    default:
                        break;
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    static async connectToRooms(socket:Socket) {
        const usr_id = await Socket_controler.findUserIdForSocket(socket);

        if (usr_id < 0)
            return;

        const userRepo = DbContext.getRepository(User)
        const findUser = await userRepo.findOne({where:{id:usr_id}, relations: ["chats","chats.chats", "chat_host"]})
        if (findUser) {
            findUser.chats.map((x)=>{
                const room = `room-${x.chats.id}`
                socket.join(room)
            })
            if (findUser.chat_host)
                findUser.chat_host.map((x)=>{
                    const room = `room-${x.id}`
                    socket.join(room)
                })
        }
    }

    static async findUserIdForSocket(socket: Socket): Promise<number>
    {
        let res:number = -1;
        const req = socket.request;
        const {Session} = req.cookies;

        if (!Session)
            return res;

        if (typeof Session == "undefined")
            return res;

        const token = verify_jwt(Session)
        if (typeof token == "undefined")
            return res;

        const parseCookie: Cookie_info = token;
        const userRepo = DbContext.getRepository(User)
        const findUser = await userRepo.findOne({where:{id:parseCookie.id}})
        
        if (!findUser)
            return res;

        res = findUser?.id;
        
        return res;
    }

    static async CheckMessageId(msg_id:number, usr_id: number): Promise<number>
    {
        let res = -1;

        if (!msg_id || !usr_id)
            return res;

        const messageRepo = DbContext.getRepository(Message);
        const userRepo = DbContext.getRepository(User)
    
        const findMessage = await messageRepo.findOne({where:{id:msg_id}, relations:['user']})
        if (!findMessage)
            return res;

        const findUser = await userRepo.findOne({where:{id:usr_id}})
        if (!findUser)
            return res;

        if (findMessage.user.id == usr_id)
        {
            res = 0;
            return res;
        }
        else 
            return res;

    }

    static async sendMessageForGroup(socket:Socket, msg:MSG) {
        try
        {
            if (msg.type == EMsgType.Room)
            {
                const usr_id = await Socket_controler.findUserIdForSocket(socket);
                if (usr_id < 0)
                {
                    socket.emit(EErrorMsg.NotFound);
                    return;
                }

                const msgAvalibl = await Socket_controler.CheckMessageId(msg.msg_id, usr_id);
                if (msgAvalibl)
                {
                    socket.emit(EErrorMsg.AccessDenie)
                    return;
                }

                const room = `room-${msg.room}`;
                msg.user_id = usr_id;
                socket.in(room).emit(room, msg)
                
                msg.type = EMsgType.Answer;
                socket.emit("Answer",msg)
            }
            else
            {
                console.log(msg)
                socket.emit(EErrorMsg.NotFound);
            }
        }
        catch (e)
        {
            socket.emit(EErrorMsg.NotFound);
            console.log(e)
        }
    }

    static async setReadedMess(messId: number, userId: number) {
        try {

        }
        catch (e) {
            console.log(e)
        }
    }
}