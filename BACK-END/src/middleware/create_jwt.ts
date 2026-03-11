import jwt from "jsonwebtoken"
import { Jwt_payload } from "../objects/jwt_payload";

export const create_jwt = (payload:Jwt_payload):string=>{
    const KEY = process.env.SIKRET_KEY || "qwe";
    const str = JSON.stringify(payload)
    return jwt.sign(JSON.parse(str), KEY, {expiresIn: "2h"})
}

export const verify_jwt = (token:string):Jwt_payload | undefined=>{
    const KEY = process.env.SIKRET_KEY || "qwe";
    try{
        const obj = jwt.verify(token, KEY);
        console.log(obj)
        if 
        (
            typeof obj != 'string' && 
            'id' in obj && 
            'name' in obj && 
            'role' in obj
        )
            return new Jwt_payload(obj.id, obj.name, obj.role)
        return undefined
    }
    catch(e)
    {
        console.log(e)
        return undefined
    }
}