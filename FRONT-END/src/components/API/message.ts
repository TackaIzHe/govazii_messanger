import axios, { HttpStatusCode } from "axios";
import { MessageProps } from "../ListMessage";

const proto = process.env.REACT_APP_API_PROTO || "http";
const host = process.env.REACT_APP_API_HOST || "localhost";
const port = process.env.REACT_APP_API_PORT || "2000";

export const getMessageForId = async(id: number): Promise<MessageProps | number> =>
{
    try{
        const res = await axios.get(`${proto}://${host}:${port}/message/${id}`, {withCredentials:true})
        if (res.status == HttpStatusCode.Ok)
            return (res.data as MessageProps);
        else 
            return -1;
    }
    catch (e)
    {
        console.log(e)
        return -1;
    }
}