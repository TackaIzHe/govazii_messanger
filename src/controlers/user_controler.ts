import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";
import { DbContext } from "../database/db";
import { User } from "../entity/user";
import { compare, crypt } from "../middleware/bcrypt";
import { create_jwt, verify_jwt } from "../middleware/create_jwt";
import { Jwt_payload } from "../objects/jwt_payload";



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
            const {name, email, password} = req.body;
            
            if (
                !email || typeof email != "string" ||
                !password || typeof password != "string" ||
                !name || typeof name != "string"
            )
                return next(Error_api.badData())
            
            const userRepo = DbContext.getRepository(User);

            const findEmail = await userRepo.findOne({where:{email:email}})
            if (findEmail)
                return next(Error_api.emailExist())
            const hashPass = await crypt(password)
            const user = userRepo.create({name:name, email:email, password: hashPass})
            await userRepo.save(user);

            res.status(201).json("Пользователь зареган")
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
            const {email, password} = req.body

            if (
                !email || typeof email != "string" ||
                !password || typeof password != "string"
            )
                return next(Error_api.badData())
            
            const userRepo = DbContext.getRepository(User);
            const findUser = await userRepo.findOne({where:{email:email}})
            if (!findUser)
                return next(Error_api.notFound())

            if (!(await compare(password, findUser.password)))
                return next(Error_api.badTryLogIn())

            res.cookie("Session", create_jwt(
                new Jwt_payload(findUser.id, findUser.name, findUser.role)), 
                {
                    httpOnly:true,
                    secure:true,
                    maxAge: 1000 * 60 * 60 * 2
                })
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
            const {oldPassword, newPassword} = req.body
            const {Session} = req.cookies

            const verifyToken = verify_jwt(Session)
            if (
                typeof verifyToken != "undefined" ||
                !Session ||
                !oldPassword || typeof oldPassword != "string" ||
                !newPassword || typeof newPassword != "string"
            )
                return next(Error_api.badData())
            
            
            res.status(200).json("Пароль изменён")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }

}