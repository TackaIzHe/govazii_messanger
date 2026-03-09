import React, { FC, useEffect, useState } from "react";
import Logo from "./Logo";
import { parseUserCookie } from "./types/IUser";
import ListElem, { ListElemProps } from "./ListElem";
import axios from "axios";
import { GetChatList } from "./types/IChat";

export interface LeftPanelProps{
    createChat: number
    createChatState: React.Dispatch<React.SetStateAction<number>>
    createChatEvent: number
    createChatEventState: React.Dispatch<React.SetStateAction<number>>
}

const LeftPanel: FC<LeftPanelProps> = ({
    createChat,
    createChatState,
    createChatEvent,
    createChatEventState
}) => {

    useEffect(()=>{
        getChatList()
    },[createChatEvent])
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";

    const [chatList, setChatList] = useState<GetChatList[]>();

    const getChatList = async() => {
        try {
            const res = await axios.get(`${proto}://${host}:${port}/chat`, {withCredentials:true})
            setChatList(res.data)
        }    
        catch (e)
        {
            console.log(e)
        }    
    }    

    const user = parseUserCookie()
    return (
        <div className="left_panel" style={{display: "inline-block"}}>
            <div style={{display:"flex", justifyContent: "space-between"}}>
                <Logo height={100} width={100}/>
                <button style={{width:"100px", margin:"10px"}} onClick={()=>{createChatState(createChat?0:1)}}>Создать группу</button>
            </div>
            <img style={{width:100, height:100}} src={`${proto}://${host}:${port}/${user.ava}`}></img>
            <h1>
                Hello world {user.name}
            </h1>

            <ListElem list={chatList?chatList:[]}/>
        </div>
    )
}

export default LeftPanel