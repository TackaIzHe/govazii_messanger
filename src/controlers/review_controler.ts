import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";

export class Review_controler{
    static async get(req:Request, res:Response, next:NextFunction){
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
    static async getAll(req:Request, res:Response, next:NextFunction){
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
    static async post(req:Request, res:Response, next:NextFunction){
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