import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";
import { DbContext } from "../database/db";
import { Message } from "../entity/message";

export class Message_controler{
    static async get(req:Request, res:Response, next:NextFunction){
        try{
            const {id} = req.params;
            const parseId = Number(id)

            if (!id || isNaN(parseId))
                return next(Error_api.badData())

            const messageRepo = DbContext.getRepository(Message)
            const message = await messageRepo.findOne({where:{id:parseId}});

            if (!message)
                return next(Error_api.notFound())

            res.status(200).json(message)
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
    static async getAll(req:Request, res:Response, next:NextFunction){
        try{
            const sqlStr = "select * from message"
            const messageRepo = DbContext.getRepository(Message)
            const messages = await messageRepo.query(sqlStr)
            
            if (!messages)
                return next(Error_api.notFound());

            res.status(200).json(messages)
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
    // static async getAllInChat(req:Request, res:Response, next:NextFunction){
    //     try{
    //         const {id} = req.params
    //         const parseId = Number(id)

    //         if (!id || isNaN(parseId))
    //             return next(Error_api.badData())

    //         const messageRepo = DbContext.getRepository(Message)
    //         const messages = await messageRepo.find()
    //         res.status(200).json("get")
    //     }
    //     catch (e)
    //     {
    //         console.log(e);
    //         return next(Error_api.serverError());
    //     }
    // }
    static async post(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("get")
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
    static async put(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("get")
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
    static async del(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("get")
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
}