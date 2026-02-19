import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";



export class User_controler{
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
            res.status(200).json("getall")
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
            res.status(200).json("post")
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
            res.status(200).json("put")
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
            res.status(200).json("del")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }

    static async reg(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("reg")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }

    static async log(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("log")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }

    static async changPass(req:Request, res:Response, next:NextFunction){
        try{
            res.status(200).json("cpasswd")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }

}