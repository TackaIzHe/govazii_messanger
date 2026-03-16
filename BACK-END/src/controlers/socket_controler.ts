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

// let onlineUser = new Set<User_s_info>();

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
                
                socket.on("disconnect", () => {
                    this.delOnlineUser(socket.id, Session)
                })
                
                socket.on('chat message', (msg) => {
                    // console.log(msg)
                })
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
            socket.on("chat message", (msg)=>{
                switch (msg) {
                    case "sendMess":
                        mess = ""
                        break;
                    case "writeMess":
                        mess = ""
                        break;
                    case "endWriteMess":
                        mess = ""
                        break;
                    case "onlineUsers":
                        mess = ""                        
                        break;
                    case "readMess":
                        mess = ""
                        break;
                
                    default:
                        break;
                }
                //this.apiSocketEvents(socket, mess);
            })
        }
        catch (e) {
            console.log(e)
        }
    }
    static async apiSocketEvents(socket:Socket, msg: string, userSocketId: string) {
        try {
            socket.to(userSocketId).emit("chat message","")
            // socket.
        }
        catch (e) {
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