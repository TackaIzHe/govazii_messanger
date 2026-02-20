import { NextFunction, Request, Response, Express} from "express";
import { Error_middleware } from "./errors/error_middleware";
import { Error_api } from "./errors/error";

const setMiddleware = (app:Express) =>{

    app.use((req:Request, res:Response, next:NextFunction)=>{
        next(Error_api.pageNotFound())
    })
    
    app.use(Error_middleware)
    
}

export default setMiddleware