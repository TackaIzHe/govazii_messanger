import { Errback, Request, Response, NextFunction } from "express";
import { Error_api } from "./error";

export function Error_middleware (err:Errback, req:Request, res:Response, next:NextFunction):any
{
    if(err instanceof Error_api){
        return res.status(err.code).json(err.value)
    }
}