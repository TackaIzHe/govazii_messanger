import { Router } from "express"
import user_router from "./user_router"
import message_router from "./message_router"
import chat_router from "./chat_router"
import reaction_router from "./reaction_router"
import review_router from "./review_router"

const router = Router();

router.use("/user", user_router);
router.use("/message", message_router)
router.use("/chat", chat_router)
router.use("/reaction", reaction_router)
router.use("/review", review_router)

export default router