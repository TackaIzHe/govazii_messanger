import {Router, NextFunction, Request, Response } from "express";
import { User_controler } from "../controlers/user_controler";

const router = Router();

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.get(req, res, next);
})

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.getAll(req, res, next);
})

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.post(req, res, next);
})

router.put("/", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.put(req, res, next);
})

router.delete("/:id", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.del(req, res, next);
})

router.post("/register", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.reg(req, res, next);
})

router.post("/loggin", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.log(req, res, next);
})

router.post("/chang_password", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.changPass(req, res, next);
})
export default router