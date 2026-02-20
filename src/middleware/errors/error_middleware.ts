import { Errback, Request, Response, NextFunction } from "express";
import { Error_api } from "./error";

export function Error_middleware (err:Errback, req:Request, res:Response, next:NextFunction):any
{
    if(err instanceof Error_api){
        err.callBack.call(0,req)
        return res.status(err.code).json(err.val)
    }
    return res.status(505).json("Необработаная ошибка!")
}