import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";
import { DbContext } from "../database/db";
import { Message } from "../entity/message";
import { verify_jwt } from "../middleware/create_jwt";
import { Chat } from "../entity/chat";
import { User } from "../entity/user";
import { Jwt_payload } from "../objects/jwt_payload";

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
            const {id} = req.params;
            const parseId = Number(id);
            const {Session} = req.cookies;
            const verifyToken = verify_jwt(Session);

            if (
                !id || isNaN(parseId) ||
                !Session || typeof verifyToken == "undefined"
            )
                return next(Error_api.badData())

            const chatRepo = DbContext.getRepository(Chat)
            const findChat = await chatRepo.findOne(
                {
                    where:{id:parseId},
                    relations: ["messages", "users", "author", "messages.user"]
                })

            if (!findChat)
                return next(Error_api.notFound())

            const existUser = findChat.users.map((user)=>{
                if (user.users.id == verifyToken.id)
                    return user
            })

            if (
                findChat.author.id != verifyToken.id &&
                existUser.length == 0
            )
                return next(Error_api.notFound())

            res.status(200).json(findChat.messages.map((x)=>{
                return {
                    id:x.id,
                    value:x.value,
                    userId:x.user.id,
                    userAva:x.user.ava,
                    userName:x.user.name
                }
            }))
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
            const {id, value} = req.body
            const {Session} = req.cookies
            const parseId = Number(id)
            const verifyToken = verify_jwt(Session)

            if (
                !id || isNaN(parseId) ||
                !value || typeof value != "string" ||
                !Session || typeof verifyToken == "undefined"
            )
                return next(Error_api.badData())

            const userRepo = DbContext.getRepository(User)
            const chatRepo = DbContext.getRepository(Chat)
            const messageRepo = DbContext.getRepository(Message)

            const findUser = await userRepo.findOne({where:
                {id:verifyToken.id}})

            if (!findUser)
                return next(Error_api.notFound())
            
            const findChat = await chatRepo.findOne({where:
                {id:parseId}})

            if (!findChat)
                return next(Error_api.notFound())

            const createMessage = messageRepo.create(
                {
                    value:value,
                    user:findUser,
                    chat:findChat
                })
            
            await messageRepo.save(createMessage)
            res.status(201).json("Сообщение создано")
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
    static async put(req:Request, res:Response, next:NextFunction){
        try{
            const {id, newValue} = req.body
            const parseId = Number(id)
            const {Session} = req.cookies;
            const verifyToken = verify_jwt(Session)

            if (
                !id || isNaN(parseId) ||
                !newValue || typeof newValue != "string" ||
                !Session || typeof verifyToken == "undefined"
            )
                return next(Error_api.badData())

            const messageRepo = DbContext.getRepository(Message)
            const findMessage = await messageRepo.findOne(
                {
                    where: {id:parseId},
                    relations: ["user"]
                })

            if (!findMessage)
                return next(Error_api.notFound())
            
            if (findMessage.user.id != verifyToken.id)
                return next(Error_api.notFound())

            findMessage.value = newValue;
            await messageRepo.save(findMessage)

            res.status(200).json("Сообщение изменено")
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
    static async del(req:Request, res:Response, next:NextFunction){
        try{
            const {Session} = req.cookies
            const {id} = req.params
            const parseId = Number(id)
            const verifyToken = verify_jwt(Session)

            if (
                !id || isNaN(parseId) ||
                !Session || typeof verifyToken == "undefined" 
            )
                return next(Error_api.badData())

            const messageRepo = DbContext.getRepository(Message)
            const findMessage = await messageRepo.findOne(
                {
                    where:{id:parseId},
                    relations: ["user"]
                })
            
            if (!findMessage)
                return next(Error_api.notFound())

            if (findMessage.user.id != verifyToken.id)
                return next(Error_api.notFound())

            await messageRepo.remove(findMessage)
            res.status(200).json("Сообщение удалено")
        }
        catch (e)
        {
            console.log(e);
            return next(Error_api.serverError());
        }
    }
}