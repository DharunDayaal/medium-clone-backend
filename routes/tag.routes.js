import { Router } from "express";
import { createTag } from "../controllers/tag.controller.js";
import authorize from "../middleware/auth.middleware.js";

const tagRouter = Router();

tagRouter.post("/create", authorize, createTag)

export default tagRouter