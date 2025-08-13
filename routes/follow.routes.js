import { Router } from "express";
import { createFollow, getFollowers, getFollowing, unfollowTheUser } from "../controllers/follow.controller.js";
import authorize from "../middleware/auth.middleware.js";

const followRouter = Router();

followRouter.post("/:id", authorize, createFollow) // User_b id
followRouter.delete("/:id", authorize, unfollowTheUser) // User_b id
followRouter.get("/following/:id", authorize, getFollowing)
followRouter.get("/followers/:id", authorize, getFollowers)

export default followRouter;