/// <reference path="../types/httpExtend.d.ts" />
import { Cookie_info } from "../objects/jwt_payload";
import { User_s_info } from "../objects/socket_obj"
import https from "https"
import http from "http"
import {Server, Socket} from "socket.io"
import { verify_jwt } from "../middleware/create_jwt";
import setCookieParser from "../middleware/socket_io_middleware";
import { DbContext } from "../database/db";
import { User } from "../entity/user";
import { Chat } from "../entity/chat";
import {MSG, EEventString, EMsgType, ESocketType, ECallState} from "../../../Heders/interfaces"
import { Message } from "../entity/message";
import { SocketUser } from "../types/socketExtend";

enum EErrorMsg {
    NotFound = "Error 404",
    AccessDenie = "Access Error"
}

/*-------------------------------------------------------------------------------------*/

export class Socket_controler {

/*-------------------------------------------------------------------------------------*/

    static async setSocket(server: https.Server | http.Server,
                           host: string,
                           proto: string,
                           port: number,
                           socket_type: number
    ) {
        try {            
            const io = new Server(server,
                {
                    cookie: true,
                    cors:
                    {
                        origin: `${proto}://${host}:${port}`,
                        credentials: true
                    }
                })

            setCookieParser(io);
            io.on('connection', (socket:SocketUser) => {
                this.socketInitUser(socket);
                socket.find_user()
                socket.set_user_connections(socket_type);
                switch (socket_type)
                {
                    case ESocketType.Msg: {
                        this.socketMsg(socket);
                        break;
                    }
                    case ESocketType.Voice: {
                        this.socketVoice(socket);
                        break;
                    }
                    case ESocketType.Video: {
                        this.socketVideo(socket);
                        break;
                    }
                }
            })
        }
        catch (e) {

        }
    }

/*-------------------------------------------------------------------------------------*/

    static async socketMsg(socket: SocketUser)
    {
        this.addOnlineUser(socket)
        this.connectToRooms(socket)
        socket.connections.set(socket.id, socket);
        socket.on("disconnect", () => {
            socket.connections.delete(socket.id);
            this.delOnlineUser(socket)
        })
        
        this.socketEvents(socket)
    }

/*-------------------------------------------------------------------------------------*/

    static async socketVoice(socket: SocketUser)
    {
        socket.voiceStreams.set(socket.id, socket);
        
        socket.on("disconnect", () => {
            socket.voiceStreams.delete(socket.id);
        })

        this.socketVoiceEvents(socket)
    }

/*-------------------------------------------------------------------------------------*/

    static async socketVideo(socket: SocketUser)
    {
        socket.videoStreams.set(socket.id, socket);
        socket.on("disconnect", () => {
            socket.videoStreams.delete(socket.id);
        })
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetIdle(socket: SocketUser)
    {
        socket.call_state = ECallState.Idle;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetAlert(socket: SocketUser)
    {
        socket.call_state = ECallState.Alert;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetRing(socket: SocketUser)
    {
        socket.call_state = ECallState.Ring;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetAnswer(socket: SocketUser)
    {
        socket.call_state = ECallState.Answer;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetTalk(socket: SocketUser)
    {
        socket.call_state = ECallState.Talk;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetRelease(socket: SocketUser)
    {
        socket.call_state = ECallState.Release;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetDisconnect(socket: SocketUser)
    {
        socket.call_state = ECallState.Disconnect;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketInitUser(socket:SocketUser)
    {
        try {
            socket.verify_cookie();
            if (socket.cookie === undefined)
                return 

            socket.set_user()

        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------------*/

    static async addOnlineUser(socket: SocketUser)
    {
        try {
            if (socket.cookie === undefined)
                return;
            
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:socket.cookie.id}})

            if (!findUser)
                return

            findUser.isOnline = true
            findUser.socketMsgId = socket.id;
            await userRepo.save(findUser);
        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async delOnlineUser(socket: SocketUser)
    {
        try {
            if (socket.cookie === undefined)
                return;

            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:socket.cookie.id}})

            if (!findUser)
                return
            findUser.socketMsgId = "";
            findUser.socketVoiceId = "";
            findUser.socketVideoId = "";
            findUser.isOnline = false;
            await userRepo.save(findUser)
        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async socketEvents(socket:SocketUser)
    {
        try {
            let mess: string = ""
            socket.on("chat message", (msg_type:EEventString, msg: MSG)=>{
                socket.verify_cookie();
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

/*-------------------------------------------------------------------------------------*/

    static async socketVoiceEvents(socket:SocketUser)
    {
        try {
            let mess: string = ""
            socket.on("chat message", (msg: ECallState)=>{
                socket.verify_cookie()
                switch (msg) {
                    case ECallState.Idle:
                        if (socket.call_state != ECallState.Idle)
                            this.socketSetIdle(socket);
                        
                        break;
                    case ECallState.Alert:
                        this.socketSetAlert(socket);
                        break;
                    case ECallState.Ring:
                        this.socketSetRing(socket);
                        break;
                    case ECallState.Answer:
                        this.socketSetAnswer(socket);
                        break;
                    case ECallState.Talk:
                        this.socketSetTalk(socket);
                        break;
                    case ECallState.Release:
                        this.socketSetRelease(socket);
                        break;
                    case ECallState.Disconnect:
                        this.socketSetDisconnect(socket);
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

/*-------------------------------------------------------------------------------------*/

    static async connectToRooms(socket:SocketUser)
    {
        const usr = await socket.get_user();

        if (usr.id < 0)
            return;

        const userRepo = DbContext.getRepository(User)
        const findUser = await userRepo.findOne({where:{id:usr.id}, relations: ["chats","chats.chats", "chat_host"]})
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

/*-------------------------------------------------------------------------------------*/

    static async findUserIdForSocket(socket: SocketUser): Promise<number>
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

/*-------------------------------------------------------------------------------------*/

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

/*-------------------------------------------------------------------------------------*/

    static async sendMessageForGroup(socket:SocketUser, msg:MSG)
    {
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

/*-------------------------------------------------------------------------------------*/

    static async setReadedMess(messId: number, userId: number)
    {
        try {

        }
        catch (e) {
            console.log(e)
        }
    }
}