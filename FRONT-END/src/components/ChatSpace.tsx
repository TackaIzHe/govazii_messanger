import { ChangeEvent, FC, FormEvent, useState } from "react"
import Logo from "./Logo"
import axios from "axios";
import ListMessage, { MessageProps } from "./ListMessage";

export interface ChatSpaceProps{
    chatId:number
    messageList: MessageProps[]
}

const ChatSpace: FC<ChatSpaceProps> = ({
    chatId,
    messageList
}) => {
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";

    const [value, setValue] = useState("")

    const updateVal = (e:ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const submitEvent = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${proto}://${host}:${port}/message`, 
            {id:chatId,value:value},
            {withCredentials:true})
            
        }    
        catch (e)
        {
            console.log(e)
        }    
    }

    return (
        <div style={{width: `100%`, height: `100vh`, backgroundColor: `#4169E1`, display:"inline-block"}}>
            <div style={{width:"100%", height: "93vh", overflowY:"auto"}}>
                <ListMessage chatId={chatId} list={messageList}/>

            </div>
            <form onSubmit={submitEvent} style={{display:"flex", justifyContent:"center"}}>
                <input type="text" style={{backgroundColor:"#679ED2", borderBlockColor:"black", borderRadius:"15px", width:"100vh", fontSize:"25px"}} 
                onChange={updateVal}/>
                <Logo width={50} height={50}/>
            </form>
        </div>
    )
}

export default ChatSpace