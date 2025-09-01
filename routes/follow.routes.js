import { Router } from "express";
import { createFollow, unfollowTheUser } from "../controllers/follow.controller.js";
import authorize from "../middleware/auth.middleware.js";

const followRouter = Router();

followRouter.post("/:id", authorize, createFollow) // User_b id
followRouter.delete("/:id", authorize, unfollowTheUser) // User_b id
followRouter.get("/:id/check", authorize, )

export default followRouter;