import express from "express"
import * as userController from "../controllers/user.controller.js"
import * as protecteRoute from "../middleware/protecteRoute.js"
import * as userMiddleware from "../middleware/user.middleware.js"
import multer from "multer";
const upload = multer({ storage : multer.memoryStorage() })
import { body } from "express-validator"
const router = express.Router()
// const uploadFields = upload.fields([
//     { name: "profilePicture", maxCount: 1 },
//     { name: "coverPicture", maxCount: 1 }
// ])

router.post("/register",userMiddleware.registerValidator, userController.registerController)
router.post("/login",userMiddleware.loginUserValidator , userController.loginController)
router.get("/profile",protecteRoute.protecteRoute, userController.profileController)
router.get("/logout",protecteRoute.protecteRoute, userController.logoutController )
router.patch("/follow/:id", protecteRoute.protecteRoute , userController.followUnfollowController)
router.patch("/editprofile", protecteRoute.protecteRoute ,upload.single("profilePicture"), userController.editProfileController)

export default router