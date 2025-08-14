import { Router } from "express";
import { createTag, getAllTags } from "../controllers/tag.controller.js";
import authorize from "../middleware/auth.middleware.js";

const tagRouter = Router();

tagRouter.get("/", authorize, getAllTags)
tagRouter.post("/create", authorize, createTag)

export default tagRouter