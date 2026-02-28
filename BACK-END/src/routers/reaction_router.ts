import { NextFunction, Request, Response, Router } from "express";
import { Reaction_controler } from "../controlers/reaction_controler";

const router = Router()

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    Reaction_controler.get(req, res, next)
})

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    Reaction_controler.getAll(req, res, next)
})

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    Reaction_controler.post(req, res, next)
})

router.put("/", (req:Request, res:Response, next:NextFunction)=>{
    Reaction_controler.put(req, res, next)
})

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    Reaction_controler.del(req, res, next)
})

export default router