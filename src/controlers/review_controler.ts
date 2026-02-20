import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";
import { DbContext } from "../database/db";
import { Review } from "../entity/review";

export class Review_controler{
    static async get(req:Request, res:Response, next:NextFunction){
        try{
            const {id} = req.params
            const parseId = Number(id)

            if (!id || isNaN(parseId))
                return next(Error_api.badData())

            const reviewRepo = DbContext.getRepository(Review)
            const review = await reviewRepo.findOne({where:{id:parseId}})

            if (!review)
                return next(Error_api.notFound())

            res.status(200).json(review)
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
            const sqlStr = "select * from review"
            const reviewRepo = DbContext.getRepository(Review)
            const reviews = await reviewRepo.query(sqlStr)

            if (!reviews)
                return next(Error_api.notFound())

            res.status(200).json(reviews)
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