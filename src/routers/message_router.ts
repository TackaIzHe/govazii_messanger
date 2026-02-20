import { NextFunction, Request, Response, Router } from "express";
import { Message_controler } from "../controlers/message_controler";

const router = Router();

router.get("/:id",async (req:Request, res:Response, next:NextFunction)=>{
    Message_controler.get(req, res, next);
})

router.get("/",async (req:Request, res:Response, next:NextFunction)=>{
    Message_controler.getAll(req, res, next);
})

// router.get("/in_chat/:id",async (req:Request, res:Response, next:NextFunction)=>{
//     Message_controler.getAllInChat(req, res, next);
// })

router.post("/",async (req:Request, res:Response, next:NextFunction)=>{
    Message_controler.post(req, res, next);
})

router.put("/",async (req:Request, res:Response, next:NextFunction)=>{
    Message_controler.put(req, res, next);
})

router.delete("/:id",async (req:Request, res:Response, next:NextFunction)=>{
    Message_controler.del(req, res, next);
})

export default router