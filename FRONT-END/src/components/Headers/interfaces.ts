export interface MSG {
    user_id: number;
    msg_id: number;
    type: EMsgType;
    msg: string;
    time: Date;
    room: number;
}

export enum EMsgType {
    Room = 0,
    Read = 1,
    Answer,
    Connected,
    Disconnected

}

export enum EEventString {
    ESendMess     = "send_mess",
    EWriteMess    = "writeMess",
    EEndWriteMess = "endWriteMess",
    EOnlineUser   = "onlineUsers",
    EReadMess     = "readMess"
}