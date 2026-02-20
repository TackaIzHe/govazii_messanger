import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";
import { DbContext } from "../database/db";
import { User } from "../entity/user";



export class User_controler{
    static async get(req:Request, res:Response, next:NextFunction){
        try{
            const {id} = req.params
            const parseId = Number(id)
            if (!id || isNaN(parseId))
                return next(Error_api.badData())

            const userRepo = DbContext.getRepository(User)
            const user = await userRepo.findOne(
                {
                    where:{id:parseId},
                    relations: ['reviews']
                })

            if (!user)
                next(Error_api.notFound())

            res.status(200).json({
                name: user?.name,
                ava: user?.ava,
                reviews: user?.reviews
            })
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
            const sqlStr = "select * from user"
            const userRepo = DbContext.getRepository(User)
            const users:Array<User> = await userRepo.query(sqlStr)

            if (!users)
                return next(Error_api.notFound())

            res.status(200).json(
                users.map((user)=>{
                    return{
                        name: user.name,
                        ava: user.ava,
                        reviews: user.reviews
                    }
                })    
            )
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }

    // static async getReviews(req:Request, res:Response, next:NextFunction){
    //     try{
    //         const {id} = req.params;
    //         const parseId = Number(id)

    //         if (!id || isNaN(parseId))
    //             return next(Error_api.badData())

    //         const userRepo = DbContext.getRepository(User)
    //         const 
    //         res.status(200).json("post")
    //     }
    //     catch (e)
    //     {
    //         console.log(e);
    //         next(Error_api.serverError());
    //         return;
    //     }
    // }

    // static async getReviewsAuthor(req:Request, res:Response, next:NextFunction){
    //     try{
    //         res.status(200).json("post")
    //     }
    //     catch (e)
    //     {
    //         console.log(e);
    //         next(Error_api.serverError());
    //         return;
    //     }
    // }
    
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