import { FC } from "react"

export interface MessageProps{
    id: number
    value: string
    userId: number
    userAva: string
    userName: string
}

export interface ListMessageProps{
    chatId: number
    list: MessageProps[]
}

const Message: FC<MessageProps> = ({
    id,
    value,
    userId,
    userAva,
    userName
}) => {
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";
    return (
        <div style={{margin:"10px", display:"flex", maxWidth:"90%", width:"90%", whiteSpace:"normal", overflowWrap:"break-word", minWidth:"0px", wordBreak:"break-word"}}>
            <img src={`${proto}://${host}:${port}/${userAva}`} style={{width:"50px", height:"50px"}}/>
            <div style={{width:"fit-content", color:"#FFFFFF", fontSize:"25px", backgroundColor:"#2c3e50",margin:"0px 0px 0px 10px", padding:"5px 10px 5px 10px", borderRadius:"10px", border:"2px solid black"}}>
                <p style={{fontSize:"15px"}}>{userName}</p>
                <p>{value}</p>
            </div>
        </div>
    )
}

const ListMessage: FC<ListMessageProps> = ({
    chatId,
    list
}) => {
    return (
        <div>
            {list.map((x, i)=>{return (<Message key={i} id={x.id} value={x.value} userId={x.userId} userAva={x.userAva} userName={x.userName}/>)})}
        </div>
    )
}

export default ListMessage