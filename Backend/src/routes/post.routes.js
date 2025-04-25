import express from "express"
import * as postController from "../controllers/post.controller.js"
import {protecteRoute} from "../middleware/protecteRoute.js"
import * as postMiddleware from "../middleware/post.middleware.js"
import multer from "multer"
import imagekit from "../services/imagekit.service.js"
import mongoose from "mongoose"

const router = express.Router()
const upload = multer({ storage : multer.memoryStorage() })

router.post("/create",protecteRoute, upload.single("media"),postMiddleware.createPost , postController.createController )
router.patch("/update/:id",protecteRoute, postController.likesController)
router.post("/comment/:id",protecteRoute, postController.commentController)
router.get("/comment/:id",protecteRoute, postController.getCommentController)
router.delete("/delete/:id",protecteRoute, postController.deletePostController)
router.post("/bookmark/:id",protecteRoute, postController.bookmarkController)



export default router