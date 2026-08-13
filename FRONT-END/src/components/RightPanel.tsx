import React, { FC, FormEvent, useState } from "react";
import Logo from "./Logo";
import Form, { Field } from "./Form";
import axios from "axios";
import { CreateChat, GetChatList, InviteUser } from "./types/IChat";
import { AppProps } from "../App";
import ChatSpace from "./ChatSpace";

// export interface RightPanelProps{
//     createChat: number
//     createChatState: React.Dispatch<React.SetStateAction<number>>
//     createChatEvent: number
//     createChatEventState: React.Dispatch<React.SetStateAction<number>>
// }

const RightPanel: FC<AppProps> = ({
    createChat,
    createChatEvent,
    createMessage,
    createMessageEvent,
    switchAll,
    chatId,
    chatMessage,
    chatInfo,
    socket
}) => {
    const [name, setName] = useState("");
    const [submit, setSubmit] = useState("Создать чат");

    const [id, setId] = useState("")
    const [userId, setUserId] = useState("")

    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";

    const sendRequestCreateChat = async(e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        await fetchVal()
    }

    const fetchVal = async() =>{
        try{

            if (name.length != 0)
            {
                const sendObj:CreateChat = {
                    name:name
                }
                const req = await axios.post(`${proto}://${host}:${port}/chat/`, sendObj, {withCredentials:true})
                createChatEvent[1](createChatEvent[0] == 0 ? 1 : 0)
            }
        }
        catch (e){
            console.log(e)
        }
    }
    const sendRequestInviteUser = async(e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        await fetchValInviteUser()
    }

    const fetchValInviteUser = async() =>{
        try{
                    const newId = Number(id);
                    const newUserId = Number(userId);
                    
                    console.log(newId)
                if (isNaN(newId) || isNaN(newUserId))
                    return

                const sendObj:InviteUser = {
                    id:newId,
                    userId:newUserId
                }
                const req = await axios.post(`${proto}://${host}:${port}/chat/add`, sendObj, {withCredentials:true})
                // createChatEvent[1](createChatEvent[0] == 0 ? 1 : 0)
        }
        catch (e){
            console.log(e)
        }
    }
    // форма для создания чата
    const fields_create_chat:Field[] = [
            {name:"name", type:"text", value:name, setVal:setName, onClick: ()=>{}},
            {name:"submit_button", type:"submit", value:submit, setVal:setSubmit, onClick: undefined}
        ]

    // форма для отправки инвайта в чат
    const fields_invite_user:Field[] = [
            {name:"id", type:"text", value:id, setVal:setId, onClick: ()=>{}},
            {name:"userId", type:"text", value:userId, setVal:setUserId, onClick: ()=>{}},
            {name:"submit_button", type:"submit", value:submit, setVal:setSubmit, onClick: undefined}
        ]
    return (
        <div className="right_panel">
            <div>
                <ChatSpace chatId={chatId[0]} messageList={chatMessage[0]} chat={chatInfo[0]} socket={socket}/>
            </div>
        </div>
    )
}

export default RightPanel