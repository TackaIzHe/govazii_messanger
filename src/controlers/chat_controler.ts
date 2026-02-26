import { Response, Request, NextFunction } from "express";
import { Error_api } from "../middleware/errors/error";
import { verify_jwt } from "../middleware/create_jwt";
import { DbContext } from "../database/db";
import { Chat } from "../entity/chat";
import { User } from "../entity/user";
import { Chat_user } from "../entity/chat_user";

export class Chat_controler{
    static async get(req:Request, res:Response, next:NextFunction){
        try{
            const {id} = req.params
            const {Session} = req.cookies
            const parseId = Number(id)
            const verifyToken = verify_jwt(Session)

            if (
                !id || isNaN(parseId) ||
                !Session || 
                typeof verifyToken == "undefined"
            )
                return next(Error_api.badData())

            const chatRepo = DbContext.getRepository(Chat)
            const findChat = await chatRepo.findOne(
                {
                    where:{id:parseId}, 
                    relations:["user"]
                })

            if (!findChat)
                return next(Error_api.notFound())

            const existchat = findChat.users.map((chat)=>{
                if (chat.users.id == Session.id)
                    return chat
            })

            if (
                findChat.author.id != Session.id &&
                existchat.length == 0
            )
                return next(Error_api.notFound())

            res.status(200).json({
                id:findChat.id,
                ava:findChat.ava,
                author:findChat.author,
                name:findChat.name,
                users:findChat.users.map((users)=>{return users.users}),
                messanges:findChat.messages
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
            const {Session} = req.cookies
            const verifyToken = verify_jwt(Session)

            if (
                !Session ||
                typeof verifyToken == "undefined"
            )
                return next(Error_api.badData())
            
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:Session.id}})
            
            if (!findUser)
                return next(Error_api.notFound())
            const chats = findUser.chat_host.concat(
                findUser.chats.map((chat)=>{return chat.chats})
            )

            res.status(200).json(chats.map((chat:Chat)=>{
                return{
                id:chat.id,
                ava:chat.ava,
                author:chat.author,
                name:chat.name,
                users:chat.users.map((users)=>{return users.users}),
                messanges:chat.messages
            }
            }))
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
            const {Session} = req.cookies
            const {name} = req.body
            const verifyToken = verify_jwt(Session)

            if (
                !Session ||
                !name || typeof name != "string" ||
                typeof verifyToken == "undefined"
            )
                return next(Error_api.badData())
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne({where:{id:Session.id}})

            if (!findUser)
                return next(Error_api.notFound())

            const chatRepo = DbContext.getRepository(Chat)
            const createChat = chatRepo.create(
                {
                    name:name,
                    author:findUser
                })
            
            await chatRepo.save(createChat)
            res.status(201).json("Чат создан")
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
    static async addUser(req:Request, res:Response, next:NextFunction){
        try{
            const {Session} = req.cookies
            const {id, userId} = req.body
            const parseId = Number(id)
            const parseIdUser = Number(userId)
            const verifyToken = verify_jwt(Session)

            if (
                !Session ||
                typeof verifyToken == "undefined" ||
                !id || isNaN(parseId) ||
                !userId || isNaN(parseIdUser)
            )
                return next(Error_api.badData())
            
            const userRepo = DbContext.getRepository(User)
            const findUser = await userRepo.findOne(
                {
                    where:{id:parseIdUser},
                    relations:["chats"]
                })

            const chatRepo = DbContext.getRepository(Chat)
            const findChat = await chatRepo.findOne(
                {
                    where:{id:parseId}, 
                    relations:["users"]
                })
            
            if (!findUser || !findChat)
                return next(Error_api.notFound())

            const existUser = findChat.users.map((chat)=>{
                if (chat.users.id == Session.id)
                    return chat.users
            })

            if (
                existUser.length == 0 ||
                findChat.author.id != Session.id
            )
                return next(Error_api.notFound())

            const chat_userRepo = DbContext.getRepository(Chat_user)
            const createChat_user = chat_userRepo.create(
                {
                    users:findUser, 
                    chats:findChat
                })
            await chat_userRepo.save(createChat_user)

            findUser.chats.push(createChat_user)
            await userRepo.save(findUser)

            findChat.users.push(createChat_user)
            await chatRepo.save(findChat)

            res.status(201).json("Пользователь добавлен")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
    static async setName(req:Request, res:Response, next:NextFunction){
        try{
            const {Session} = req.cookies
            const {id, name} = req.body
            const verifyToken = verify_jwt(Session)
            const parseId = Number(id)
            
            if (
                !id || isNaN(parseId) ||
                !Session || typeof verifyToken == "undefined" ||
                !name || typeof name != "string"
            )
                return next(Error_api.badData())

            const chatRepo = DbContext.getRepository(Chat)
            const findChat = await chatRepo.findOne(
                {
                    where:{id:parseId},
                    relations: ["author"]
                })

            if (!findChat)
                return next(Error_api.notFound())

            if (findChat.author.id != Session.id)
                return next(Error_api.notFound())

            findChat.name = name;
            await chatRepo.save(findChat)
            res.status(200).json("Имя обновлено")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
    static async setAva(req:Request, res:Response, next:NextFunction){
        try{
            const {Session} = req.cookies
            const ava = <Express.Multer.File>req.file
            const {id} = req.body
            const verifyToken = verify_jwt(Session)
            const parseId = Number(id)
            
            if (
                !id || isNaN(parseId) ||
                !Session || typeof verifyToken == "undefined" ||
                !ava
            )
                return next(Error_api.badData())

            const chatRepo = DbContext.getRepository(Chat)
            const findChat = await chatRepo.findOne(
                {
                    where:{id:parseId}
                })

            if (!findChat)
                return next(Error_api.notFound())

            if (findChat.author.id != Session.id)
                return next(Error_api.notFound())

            findChat.ava = ava.filename;
            await chatRepo.save(findChat)
            res.status(200).json("Ава обновлена")
        }
        catch (e)
        {
            console.log(e);
            next(Error_api.serverError());
            return;
        }
    }
}