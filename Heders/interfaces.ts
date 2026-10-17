export interface MSG {
    user_id: number;
    msg_id: number;
    type: EMsgType;
    msg: string;
    time: Date;
    room: number;
}

export interface SipMsg {
    room: number;
    sig: ECallState;
}

export enum EMsgType {
    Room = 0,
    Read = 1,
    Answer,
    Connected,
    Disconnected
}

export enum ESipConfAct {
    Connect = 0,
    Disconnect = 1
}

export enum ECallState {
    Idle = 0,
    Alert = 1,
    Ring,
    Answer,
    Talk,
    Release,
    Disconnect
}

export enum ESocketMsgType {
    Msg = 0,
    Voice = 1,
    Video
}

export enum ESocketStreamType {
    Voice = 1,
    Video = 2
}

export enum EEventString {
    ESendMess     = "send_mess",
    EWriteMess    = "writeMess",
    EEndWriteMess = "endWriteMess",
    EOnlineUser   = "onlineUsers",
    EReadMess     = "readMess",
    ESip          = "sip"
}
