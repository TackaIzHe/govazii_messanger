import {Router, NextFunction, Request, Response } from "express";
import { User_controler } from "../controlers/user_controler";
import multer from "multer";
import { uploadImg } from "../middleware/upload_middleware";

const router = Router();
const upload = multer({storage:uploadImg("../../static")})

router.get("/:id", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.get(req, res, next);
})

router.get("/", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.getAll(req, res, next);
})

router.post("/", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.post(req, res, next);
})

router.put("/set_name", (req:Request, res:Response, next:NextFunction)=>{
    User_controler.setName(req, res, next);
})

router.put("/set_ava",upload.single('ava'), (req:Request, res:Response, next:NextFunction)=>{
    User_controler.setAva(req, res, next);
})

router.delete("/", (req:Request, res:Response, next:NextFunction)=>{
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