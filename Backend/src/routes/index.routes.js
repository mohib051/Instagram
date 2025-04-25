import express from "express"
import * as feedController from "../controllers/index.controller.js"
import {protecteRoute} from "../middleware/protecteRoute.js"

const router = express.Router()

router.get("/feed",protecteRoute,feedController.feedController)
router.get("/user/:id",protecteRoute , feedController.userProfileController )


export default router