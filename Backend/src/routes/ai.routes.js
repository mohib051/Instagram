import { Router } from "express";
import * as postController from "../controllers/post.controller.js"
import { protecteRoute } from "../middleware/protecteRoute.js";
import multer from "multer";
const upload = multer({ storage : multer.memoryStorage() })
const router = Router()

router.post("/",upload.single("media"),protecteRoute , postController.createCaption)


export default router