import { Cookie_info } from "./jwt_payload"
import { Socket } from "socket.io"

export class SocketExtends extends Socket{
    
    cookies: Record<string,string> = Object.create(null);
}

export interface User_s_info{
    id: string
    cookie: Cookie_info
}

export interface send_mess_from_socket{
    chatId: number
    mess: string
}