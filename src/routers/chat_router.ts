import { NextFunction, Request, Response, Router } from "express";
import { Chat_controler } from "../controlers/chat_controler";

const router = Router();

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    Chat_controler.get(req, res, next)
})

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    Chat_controler.getAll(req, res, next)
})

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    Chat_controler.post(req, res, next)
})

router.put("/", (req:Request, res:Response, next:NextFunction)=>{
    Chat_controler.put(req, res, next)
})

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    Chat_controler.del(req, res, next)
})

router.post("/add", (req:Request, res:Response, next:NextFunction)=>{
    Chat_controler.addUser(req, res, next)
})

export default router