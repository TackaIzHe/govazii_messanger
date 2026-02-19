import { Router } from "express"
import user_router from "./user_router"

const router = Router();

router.use("/user", user_router);

export default router