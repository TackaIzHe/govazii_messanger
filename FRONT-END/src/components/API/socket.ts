import { Socket } from "socket.io-client";
import { ECallState, EEventString, ESocketMsgType, SipMsg } from "../Headers/interfaces";

export const sig_to_room = (socket:Socket, id:number, sig: ECallState) => {
        const msg:SipMsg = {
            room: id,
            sig: sig
        } 
        socket.emit("chat message", ESocketMsgType.Msg, EEventString.ESip, msg);
    }

export const send_pack_to_room = (socket:Socket, id:number, pack:ArrayBuffer) => {
        socket.emit("chat message", ESocketMsgType.Voice, null, null, pack);
    }