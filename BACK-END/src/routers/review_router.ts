import { NextFunction, Request, Response, Router } from "express";
import { Review_controler } from "../controlers/review_controler";

const router = Router()

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    Review_controler.get(req, res, next)
})

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    Review_controler.getAll(req, res, next)
})

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    Review_controler.post(req, res, next)
})

router.put("/", (req:Request, res:Response, next:NextFunction)=>{
    Review_controler.put(req, res, next)
})

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    Review_controler.del(req, res, next)
})

export default router