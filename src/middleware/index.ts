import { NextFunction, Request, Response, Router } from "express";
import { Error_middleware } from "./errors/error_middleware";
import { Error_api } from "./errors/error";

const middleware = Router();

middleware.use((req:Request, res:Response, next:NextFunction)=>{
    next(Error_api.pageNotFound())
})

middleware.use(Error_middleware)

export default middleware