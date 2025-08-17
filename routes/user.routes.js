import { Router } from "express";
import { getFollowingUsers, getUserFollowers, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.get("/profile/:userId", authorize, getUserProfile)
userRouter.put("/profile/update/:userId", authorize, updateUserProfile)
userRouter.get("/follows/:userId", authorize, getFollowingUsers)
userRouter.get("/followers/:userId", authorize, getUserFollowers)

export default userRouter