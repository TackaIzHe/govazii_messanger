import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";
import { DbContext } from "../database/db";
import { Reaction } from "../entity/reaction";

export class Reaction_controler{
    static async get(req:Request, res:Response, next:NextFunction){
        try{
            const {id} = req.params
            const parseId = Number(id)

            if (!id || isNaN(parseId))
                return next(Error_api.badData())

            const reactionRepo = DbContext.getRepository(Reaction)
            const reaction = await reactionRepo.findOne({where:{id:parseId}})

            if (!reaction)
                return next(Error_api.notFound())

            res.status(200).json(reaction)
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
    static async getAll(req:Request, res:Response, next:NextFunction){
        try{
            const sqlStr = "select * from reaction"
            const reactionRepo = DbContext.getRepository(Reaction)
            const reactions:Array<Reaction> = await reactionRepo.query(sqlStr)

            if (!reactions)
               return next(Error_api.notFound())

            res.status(200).json(reactions)
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
    static async post(req:Request, res:Response, next:NextFunction){
        try{
            
            res.status(201).json("get")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
    static async put(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("get")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
    static async del(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("get")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
}