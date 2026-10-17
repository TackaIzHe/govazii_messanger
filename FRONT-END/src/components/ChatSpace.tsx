import { ChangeEvent, FC, FormEvent, RefObject, useEffect, useState } from "react"
import Logo from "./Logo"
import axios from "axios";
import ListMessage, { MessageProps } from "./ListMessage";
import { DialogList, GetChatList } from "./types/IChat";
import { Socket } from "socket.io-client";
import {MSG, EEventString, EMsgType, ESocketMsgType, SipMsg, ESipConfAct, ECallState} from "./Headers/interfaces"

import styles from "../styles/rightPanel.module.css";

export interface ChatSpaceProps {
    chatId: number
    chat: GetChatList
    messageList: MessageProps[]
    socket: Socket
    dialog_ref_array: RefObject<HTMLDialogElement[]>
}

const ChatSpace: FC<ChatSpaceProps> = ({
    chatId,
    chat,
    messageList,
    socket,
    dialog_ref_array
}) => {
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";

    const [value, setValue] = useState("")
    const updateVal = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const submitEvent = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const res = await axios.post(`${proto}://${host}:${port}/message`,
                { id: chatId, value: value },
                { withCredentials: true })
                // нужно отпровлять объект что бы коректно отоброжать информацию

            const msg_id:number = Number((res.data as string).split("-")[1]);
            const msg:MSG = {
                user_id: 0,
                msg_id: msg_id,
                type: EMsgType.Room,
                time: new Date(),
                msg: value,
                room: chatId
            }
            socket.emit("chat message", ESocketMsgType.Msg, EEventString.ESendMess, msg);
        }
        catch (e) {
            console.log(e)
        }
    }

    const openSetings = () => {
        if (!dialog_ref_array.current[DialogList.Eadd_user_to_chat].open)
            dialog_ref_array.current[DialogList.Eadd_user_to_chat].show()
        else
            dialog_ref_array.current[DialogList.Eadd_user_to_chat].close()
    }

    const sig_to_room = (sig: ECallState) => {
        const msg:SipMsg = {
            room: chatId,
            sig: sig
        } 
        socket.emit("chat message", ESocketMsgType.Msg, EEventString.ESip, msg);
    }

    return (
        <div className={styles.chat_space}>
            <div className={styles.chat_header}>
                <img className={styles.left} src={`${proto}://${host}:${port}/${chat.ava}`}/>
                <h1 className={styles.center}>{chat.name}</h1>
                <div className={styles.right}>
                    <Logo _className={styles.right} onClickFunc={openSetings}/>
                </div>
            </div>
                    <button style={{fontSize:32}} onClick={() => sig_to_room(ECallState.Ring)}>Вызов</button>
                    <button style={{fontSize:32}} onClick={() => sig_to_room(ECallState.Release)}>Отключится</button>
        
            <div className={styles.chat_message_list}>
                <ListMessage chatId={chatId} list={messageList} />

            </div>
            <form onSubmit={submitEvent} className={styles.chat_input}>
                <input type="text"
                    onChange={updateVal} />
                <Logo width={50} height={50} />
            </form>
        </div>
    )
}

export default ChatSpace