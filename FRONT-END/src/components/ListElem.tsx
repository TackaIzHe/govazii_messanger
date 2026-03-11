import axios from "axios"
import React, { FC } from "react"
import { GetChatList } from "./types/IChat"
import { MessageProps } from "./ListMessage"

export interface ElemProps{
    id: number
    name: string
    ava: string
    chatId: [number, React.Dispatch<React.SetStateAction<number>>]
    chatMessage: React.Dispatch<React.SetStateAction<MessageProps[]>>
} 

export interface ListElemProps{
    list: GetChatList[]
    switchState: [number, React.Dispatch<React.SetStateAction<number>>]
    switchAll: Function
    chatId: [number, React.Dispatch<React.SetStateAction<number>>]
    chatMessage: React.Dispatch<React.SetStateAction<MessageProps[]>>
}

const Elem: FC<ElemProps> = ({
    id,
    name,
    ava,
    chatId,
    chatMessage
}) => {
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";
    const addr = `${proto}://${host}:${port}`

    const getMessage = async(id:number) => {
        const res = await axios.get(`${addr}/message/get_all/${id}`, {withCredentials:true})
        chatMessage(res.data)
    }
    
    return (
        <div>
            <div style={{display:"flex", margin: 10}} onClick={()=>{getMessage(id); chatId[1](id)}}>
                <img key={id} src={`${addr}/${ava}`} style={{width:100, height:100}}></img>
                <h2>{name}</h2>
            </div>
        </div>
    )
}

const ListElem: FC<ListElemProps> = ({
    list, switchState, switchAll, chatId, chatMessage
}) => {
    return (
        <div onClick={()=>{switchAll(switchState)}} style={{overflow:"scroll", height:"70vh"}}>
            {list.map((x, i) => {
                return (
                    <Elem key={i} id={x.id} name={x.name} ava={x.ava} chatId={chatId} chatMessage={chatMessage}/>
                )
            })}
        </div>
    )
}

export default ListElem;