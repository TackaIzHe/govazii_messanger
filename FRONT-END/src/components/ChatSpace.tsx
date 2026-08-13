import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react"
import Logo from "./Logo"
import axios from "axios";
import ListMessage, { MessageProps } from "./ListMessage";
import { GetChatList } from "./types/IChat";
import { Socket } from "socket.io-client";

import styles from "../styles/rightPanel.module.css";

export interface ChatSpaceProps {
    chatId: number
    chat: GetChatList
    messageList: MessageProps[]
    socket: Socket
}

const ChatSpace: FC<ChatSpaceProps> = ({
    chatId,
    chat,
    messageList,
    socket
}) => {
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";

    const [value, setValue] = useState("")
    const updateVal = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const submitEvent = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${proto}://${host}:${port}/message`,
                { id: chatId, value: value },
                { withCredentials: true })
                // нужно отпровлять объект что бы коректно отоброжать информацию
            socket.emit("chat message", "send_mess", chatId, value);
        }
        catch (e) {
            console.log(e)
        }
    }

    const openSetings = () => {
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