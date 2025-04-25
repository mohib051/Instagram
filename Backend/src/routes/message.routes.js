import { Router } from "express";
import * as messageController from "../controllers/message.controller.js";
import { protecteRoute } from "../middleware/protecteRoute.js";
const router = Router();

router.post("/send/:id",protecteRoute, messageController.sendMessageController)
router.get("/all/:id",protecteRoute, messageController.getMessageController)

export default router