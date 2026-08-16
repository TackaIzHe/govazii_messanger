import React, { FC, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { parseUserCookie } from "./types/IUser";
import ListElem, { ListElemProps } from "./ListElem";
import axios from "axios";
import { DialogList, GetChatList } from "./types/IChat";
import { AppProps } from "../App";

// export interface LeftPanelProps{
//     createChat: number
//     createChatState: React.Dispatch<React.SetStateAction<number>>
//     createChatEvent: number
//     createChatEventState: React.Dispatch<React.SetStateAction<number>>
// }

const LeftPanel: FC<AppProps> = ({
    createChat,
    createChatEvent,
    createMessage,
    createMessageEvent,
    switchAll,
    chatId,
    chatMessage,
    chatInfo,
    panel_ref,
    hiden_func,
    dialog_ref_array
}) => {

    useEffect(()=>{
        getChatList()
    },[createChatEvent[0]])

    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";

    const [chatList, setChatList] = useState<GetChatList[]>();

    const getChatList = async() => {
        switchAll(createMessage)
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

    const show_close = () => {
        if (!dialog_ref_array.current[DialogList.Ecreate_chat].open)
            dialog_ref_array.current[DialogList.Ecreate_chat].show()
        else
            dialog_ref_array.current[DialogList.Ecreate_chat].close()
    }
    return (
        <div className="left_panel" ref={panel_ref}>
                <Logo _className="left"/>
                <button className="right" onClick={()=>{show_close()}}>Создать группу</button>
            <div>
                <img src={`${proto}://${host}:${port}/${user.ava}`}></img>
                <ListElem _classname="chat_list" list={chatList?chatList:[]} switchState={createMessage} switchAll={switchAll} chatId={chatId} chatMessage={chatMessage[1]} chatInfo={chatInfo[1]}/>
            </div>
            <button className="hiden_button" onClick={()=>hiden_func()}>{"<->"}</button>
        </div>
    )
}

export default LeftPanel