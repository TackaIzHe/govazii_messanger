/// <reference path="../types/httpExtend.d.ts" />
/// <reference path="../types/socketExtend.d.ts" />
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
import {MSG, EEventString, EMsgType, ESocketMsgType, ECallState, ESocketStreamType, SipMsg} from "../../../Heders/interfaces"
import { Message } from "../entity/message";

enum EErrorMsg {
    NotFound = "Error 404",
    AccessDenie = "Access Error"
}

let connections = new Map<string, Socket>()
// let voiceStreams = new Map<string, Socket>()
// let videoStreams = new Map<string, Socket>()

/*-------------------------------------------------------------------------------------*/

    function verify_cookie(socket: Socket): void 
    {
        try {
            socket.cookie = undefined;

            if (!socket.request)
                return

            if (!socket.request.cookies)
                return

            const { Session } = socket.request.cookies;
            if (typeof Session == "undefined")
                return;

            const token = verify_jwt(Session)
            if (typeof token == "undefined")
                return;

            const parseCookie: Cookie_info = token;
            socket.cookie = parseCookie;
        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    async function get_user(socket: Socket): Promise<User | undefined>
    {
        verify_cookie(socket)

        if (socket.cookie === undefined)
            return 

        return socket.user;
    }

/*-------------------------------------------------------------------------------------*/

    async function set_user(socket: Socket): Promise<number>
    {
        verify_cookie(socket)

        if (socket.cookie === undefined)
            return -1;

        const userRepo = DbContext.getRepository(User);
        const findUser = await userRepo.findOne({ where: { id: socket.cookie.id } })

        if (findUser) {
            socket.user = findUser;
            return socket.user.id;
        }
        else {
            socket.user = undefined;
            return -1;
        }
    }

    async function find_user(socket: Socket): Promise<User | undefined>
    {
        verify_cookie(socket)

        if (socket.cookie === undefined)
            return undefined;

        const userRepo = DbContext.getRepository(User);
        const findUser = await userRepo.findOne({ where: { id: socket.cookie.id } })

        if (findUser) {
            return findUser;
        }
        else {
            return undefined;
        }
    }

/*-------------------------------------------------------------------------------------*/

    async function set_user_connections(socket: Socket): Promise<number>
    {
        const user = await find_user(socket)
        const userRepo = DbContext.getRepository(User);
        if (user === undefined)
            return -1;

        if (connections.get(socket.id))
            user.socketId = socket.id;

        await userRepo.save(user);
        return 0;
    }


/*-------------------------------------------------------------------------------------*/

export class Socket_controler {

/*-------------------------------------------------------------------------------------*/

    static async setSocket(server: https.Server | http.Server,
                           host: string,
                           proto: string,
                           port: number
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

            io.on('connection', async(socket:Socket) => {
                socket.call_state = 0;
                this.socketInitUser(socket);
                await find_user(socket)
                await set_user_connections(socket);
                this.socketMsg(socket);
            })
        }
        catch (e) {

        }
    }

/*-------------------------------------------------------------------------------------*/

    static async socketMsg(socket: Socket)
    {
        this.addOnlineUser(socket)
        this.connectToMsgRooms(socket)
        connections.set(socket.id, socket);
        socket.on("disconnect", () => {
            connections.delete(socket.id);
            this.delOnlineUser(socket)
        })
        
        this.socketPack(socket)
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetIdle(socket: Socket)
    {
        socket.call_state = ECallState.Idle;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetAlert(socket: Socket)
    {
        socket.call_state = ECallState.Alert;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetRing(socket: Socket, callId: number)
    {
        if (socket.call_state == ECallState.Ring)
            return -1;

        if (socket.call_room_id != callId)
        {
            socket.call_state = ECallState.Ring;
            socket.call_room_id = callId;
            return callId;
        }
        else
        {
            return -1;
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetAnswer(socket: Socket)
    {
        socket.call_state = ECallState.Answer;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetTalk(socket: Socket)
    {
        socket.call_state = ECallState.Talk;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetRelease(socket: Socket)
    {
        if (socket.call_state != ECallState.Release)
        {
            socket.call_room_id = -1;
            socket.call_state = ECallState.Release;
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async socketSetDisconnect(socket: Socket)
    {
        socket.call_state = ECallState.Disconnect;
    }

/*-------------------------------------------------------------------------------------*/

    static async socketInitUser(socket:Socket)
    {
        try {
            verify_cookie(socket);
            if (socket.cookie === undefined)
                return 

            set_user(socket)

        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------------*/

    static async addOnlineUser(socket: Socket)
    {
        try {
            if (socket.cookie === undefined)
                return;
            
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:socket.cookie.id}})

            if (!findUser)
                return

            findUser.isOnline = true
            findUser.socketId = socket.id;
            await userRepo.save(findUser);
        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async delOnlineUser(socket: Socket)
    {
        try {
            if (socket.cookie === undefined)
                return;

            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:socket.cookie.id}})

            if (!findUser)
                return
            findUser.socketId = "";
            findUser.isOnline = false;
            await userRepo.save(findUser)
        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async socketPack(socket: Socket)
    {
        socket.on("chat message", (pack_type: ESocketMsgType,
                                   msg_type:EEventString,
                                   msg?: MSG | SipMsg,
                                   voicePack?: MediaStream,
                                   videoPack?:MediaStream)=>{
            verify_cookie(socket);
            switch (pack_type)
            {
                case ESocketMsgType.Msg:
                    this.socketEvents(socket, msg_type, msg);
                    break;
                case ESocketMsgType.Video:
                    if (videoPack)
                        this.sendCallPackForGroup(socket, videoPack);
                    // this.socketPackEvents(socket, videoPack, ESocketStreamType.Video);
                    break;
                case ESocketMsgType.Voice:
                    if (voicePack)
                        this.sendCallPackForGroup(socket, voicePack)
                    // this.socketPackEvents(socket, voicePack, ESocketStreamType.Voice);
                    break;
            }
        })
    }

/*-------------------------------------------------------------------------------------*/

    static async socketEvents(socket:Socket, msg_type:EEventString, msg?: MSG | SipMsg)
    {
        try {
            switch (msg_type) {
                case EEventString.ESendMess:
                    if (msg)
                        this.sendMessageForGroup(socket, msg as MSG);
                    break;
                case EEventString.EWriteMess:
                    break;
                case EEventString.EEndWriteMess:
                    break;
                case EEventString.EOnlineUser:
                    break;
                case EEventString.EReadMess:
                    break;
                case EEventString.ESip:
                    if (msg)
                        this.socketCallEvents(socket, msg as SipMsg)
                    break;
            
                default:
                    break;
            }
        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async socketCallEvents(socket: Socket, msg: SipMsg, is_verify = 0)
    {
        try {
                if (is_verify)
                    verify_cookie(socket)
                
                switch (msg.sig) {
                    case ECallState.Idle:
                        if (socket.call_state != ECallState.Idle)
                            this.socketSetIdle(socket);
                        
                        break;
                    case ECallState.Alert:
                        this.socketSetAlert(socket);
                        break;
                    case ECallState.Ring:
                        if (await this.socketSetRing(socket, msg.room) < 0)
                            break;

                        await this.connectToCallRooms(socket);
                        this.sendCallSigForGroup(socket, ECallState.Alert);
                        break;
                    case ECallState.Answer:
                        this.socketSetAnswer(socket);
                        break;
                    case ECallState.Talk:
                        this.socketSetTalk(socket);
                        break;
                    case ECallState.Release:
                        await this.sendCallSigForGroup(socket, ECallState.Release);
                        await this.disconnectFromCallRooms(socket);
                        await this.socketSetRelease(socket);
                        msg.sig = ECallState.Disconnect;
                        this.socketCallEvents(socket, msg, 1);
                        break;
                    case ECallState.Disconnect:
                        this.socketSetDisconnect(socket);
                        msg.sig = ECallState.Idle;
                        this.socketCallEvents(socket, msg, 1);
                        break;
                
                    default:
                        break;
            }
        }
        catch (e) {
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async connectToMsgRooms(socket:Socket)
    {
        const usr = await get_user(socket);

        if (!usr || usr.id < 0)
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

    static async connectToCallRooms(socket:Socket)
    {
        const usr = await get_user(socket);
        let is_access = false;

        if (!usr || usr.id < 0)
            return;

        const userRepo = DbContext.getRepository(User)
        const findUser = await userRepo.findOne({where:{id:usr.id}, relations: ["chats","chats.chats", "chat_host"]})
        if (findUser) {
            findUser.chats.map(()=>{
                is_access = true;
            })
            if (findUser.chat_host)
                findUser.chat_host.map(()=>{
                    is_access = true;
                })
            if (is_access)
            {
                const room = `call-room-${socket.call_room_id}`
                socket.join(room)
            }
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async disconnectFromCallRooms(socket:Socket)
    {
        const usr = await get_user(socket);
        let is_access = false;

        if (!usr || usr.id < 0)
            return;

        const userRepo = DbContext.getRepository(User)
        const findUser = await userRepo.findOne({where:{id:usr.id}, relations: ["chats","chats.chats", "chat_host"]})
        if (findUser) {
            findUser.chats.map(()=>{
                is_access = true;
            })
            if (findUser.chat_host)
                findUser.chat_host.map(()=>{
                    is_access = true;
                })
            if (is_access)
            {
                const room = `call-room-${socket.call_room_id}`
                socket.leave(room)
            }
        }
    }

/*-------------------------------------------------------------------------------------*/

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

    static async sendMessageForGroup(socket:Socket, msg:MSG)
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

    static async sendCallPackForGroup(socket:Socket, pack: MediaStream)
    {
        try
        {
                const usr_id = await Socket_controler.findUserIdForSocket(socket);
                if (usr_id < 0)
                {
                    socket.emit(EErrorMsg.NotFound);
                    return;
                }

                const room = `call-room-${socket.call_room_id}`;
                socket.in(room).emit(room, null, null, pack)

                // socket.emit("Answer",pack, "ok")
            
            
        }
        catch (e)
        {
            socket.emit(EErrorMsg.NotFound);
            console.log(e)
        }
    }

/*-------------------------------------------------------------------------------------*/

    static async sendCallSigForGroup(socket:Socket, sig: ECallState)
    {
        try
        {
                const usr_id = await Socket_controler.findUserIdForSocket(socket);
                if (usr_id < 0)
                {
                    socket.emit(EErrorMsg.NotFound);
                    return;
                }

                const room = `call-room-${socket.call_room_id}`;
                socket.in(room).emit(room, null, sig)
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