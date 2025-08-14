import { Router } from "express";
import { createComment, createReplyComment, deleteComment, getAllComments, likeAndUnlike, updateCommentAndReplyComment } from "../controllers/comments.controller.js";
import authorize from "../middleware/auth.middleware.js";

const commentRouter = Router();

commentRouter.get("/:postId", authorize, getAllComments)
commentRouter.post("/create/:postId", authorize, createComment)
commentRouter.post("/create/:commentId/replies", authorize, createReplyComment)
commentRouter.put("/update/:commentId", authorize, updateCommentAndReplyComment)
commentRouter.put("/like/:commentId", authorize, likeAndUnlike)
commentRouter.delete("delete/:commentId", authorize, deleteComment)

export default commentRouter