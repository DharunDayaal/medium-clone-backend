import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getMyPosts,
    getPostById,
    getPostsByTag,
    likePost,
    publishPost,
    unpublishPost,
    updatePost
} from "../controllers/post.controller.js";
import authorize from "../middleware/auth.middleware.js";

const postRouter = Router();

postRouter.get("/", authorize, getAllPosts);
postRouter.post("/create", authorize, createPost);
postRouter.put("/publish/:id", authorize, publishPost);
postRouter.get("/:slugAndId", authorize, getPostById);
postRouter.put("/unpublish/:id", authorize, unpublishPost);
postRouter.delete("/delete/:id", authorize, deletePost);
postRouter.post("/:id/like", authorize, likePost); // Same endpoint for like and unliking the post.
postRouter.get("/tag/:tagName", authorize, getPostsByTag);
postRouter.get("/user/:id", authorize, getMyPosts);
postRouter.put("/update/:id", authorize, updatePost);


// // Search posts
// postRouter.get("/search", authorize, searchPosts);

export default postRouter;