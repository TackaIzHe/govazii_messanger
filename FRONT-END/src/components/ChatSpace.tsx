import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react"
import Logo from "./Logo"
import axios from "axios";
import ListMessage, { MessageProps } from "./ListMessage";
import { GetChatList } from "./types/IChat";

export interface ChatSpaceProps {
    chatId: number
    chat: GetChatList
    messageList: MessageProps[]
}

const ChatSpace: FC<ChatSpaceProps> = ({
    chatId,
    chat,
    messageList
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
        }
        catch (e) {
            console.log(e)
        }
    }

    const openSetings = () => {
    }

    return (
        <div style={{ width: `100%`, height: `100vh`, backgroundColor: `#4169E1`, display: "inline-block" }}>
            <div style={{ height: "10vh", backgroundColor: "#679ED2", borderBlockColor: "black", fontSize: "25px"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{display:"flex", justifyContent:"left", alignItems:"center"}}>
                        <img src={`${proto}://${host}:${port}/${chat.ava}`} style={{ margin:"10px", width: "70px", height: "70px"}}/>
                        <h1>{chat.name}</h1>
                    </div>
                    <div>
                        <Logo width={70} height={70} onClickFunc={openSetings}/>
                    </div>
                </div>
            </div>
            <div style={{ width: "100%", height: "83vh", overflowY: "auto" }}>
                <ListMessage chatId={chatId} list={messageList} />

            </div>
            <form onSubmit={submitEvent} style={{ display: "flex", justifyContent: "center" }}>
                <input type="text" style={{ backgroundColor: "#679ED2", borderBlockColor: "black", borderRadius: "15px", width: "100vh", fontSize: "25px" }}
                    onChange={updateVal} />
                <Logo width={50} height={50} />
            </form>
        </div>
    )
}

export default ChatSpace