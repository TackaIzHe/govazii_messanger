import React, { FC, FormEvent, useState } from "react";
import Logo from "./Logo";
import Form, { Field } from "./Form";
import axios from "axios";
import { CreateChat } from "./types/IChat";

export interface RightPanelProps{
    createChat: number
    createChatState: React.Dispatch<React.SetStateAction<number>>
    createChatEvent: number
    createChatEventState: React.Dispatch<React.SetStateAction<number>>
}

const RightPanel: FC<RightPanelProps> = ({
    createChat,
    createChatState,
    createChatEvent,
    createChatEventState
}) => {
    const [name, setName] = useState("");
    const [submit, setSubmit] = useState("Создать чат");

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
                createChatEventState(createChatEvent == 0 ? 1 : 0)
            }
        }
        catch (e){
            console.log(e)
        }
    }

    const fields:Field[] = [
            {name:"name", type:"text", value:name, setVal:setName, onClick: ()=>{}},
            {name:"submit_button", type:"submit", value:submit, setVal:setSubmit, onClick: undefined}
        ]
    return (
        <div className="right_panel">
            <Logo height={100} width={100}/>
            {createChat == 1?
            (<div className="createChat">
                <Form name="createChat" width={500} height={100} fields={fields} submit={sendRequestCreateChat}/>
            </div>)
            :""}
        </div>
    )
}

export default RightPanel