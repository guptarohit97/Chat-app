import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router=express.Router();

router.get("/users",getUsersForSidebar,protectRoute)
router.get("/:id",getMessages,protectRoute)
router.post("/send/:id",sendMessage,protectRoute)

export default router;