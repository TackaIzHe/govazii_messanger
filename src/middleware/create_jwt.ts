import jwt from "jsonwebtoken"
import { Jwt_payload } from "../objects/jwt_payload";

export const create_jwt = (payload:Jwt_payload):string=>{
    const KEY = process.env.SIKRET_KEY || "qwe";
    const str = JSON.stringify(payload)
    return jwt.sign(JSON.parse(str), KEY, {expiresIn: "2h"})
}

export const verify_jwt = (token:string)=>{
    const KEY = process.env.SIKRET_KEY || "qwe";
    try{
        return jwt.verify(token, KEY)
    }
    catch(e)
    {
        console.log(e)
        return undefined
    }
}