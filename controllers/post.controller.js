import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import Tag from "../models/tag.model.js";

export const createPost = async (req, res, next) => {
    try {
        const posts = await Post.create({
            ...req.body,
            aurthor: req.user._id
        })

        if (posts.tags && posts.tags.length > 0) {
            await Tag.updateMany(
                { _id: { $in: posts.tags } },
                { $inc: { postsCount: 1 } }
            )
        }

        res.status(201).json({
            success: true,
            message: "Post created successfully",
        })

    } catch (error) {
        next(error)
    }
}

export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ status: "published", aurthor: { $ne: req.user.id } }).select("-oldSlugs").populate("aurthor", "name profileImage followersCount").populate("tags", "name description")
        res.status(200).json({
            success: true,
            message: "success",
            data: posts
        })
    } catch (error) {
        next(error)
    }
}

export const publishPost = async (req, res, next) => {
    try {
        if (!req.params.id) {
            const error = new Error("Post ID is required");
            error.statusCode = 404;
            throw error;
        }
        const post = await Post.findById(req.params.id);

        if (post.status !== "draft") {
            const error = new Error("Post already published");
            error.statusCode = 429;
            throw error;
        }

        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        const publishedPost = await Post.updateOne({ _id: req.params.id }, { $set: { status: "published" } })
        res.status(200).json({
            success: true,
            message: "Post published successfully",
        })

    } catch (error) {
        next(error)
    }
}

export const getPostById = async (req, res, next) => {
    try {
        if (!req.params.slugAndId) {
            const error = new Error("Post ID is required");
            error.statusCode = 404;
            throw error;
        }

        const id = req.params.slugAndId.split("-").pop();

        const post = await Post.findById(id).select("-oldSlugs").populate("aurthor", "name profileImage followersCount").populate("tags", "name description")

        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "success",
            data: post
        })
    } catch (error) {
        next(error)
    }
}

export const unpublishPost = async (req, res, next) => {
    try {
        if (!req.params.id) {
            const error = new Error("Post ID is required");
            error.statusCode = 404;
            throw error;
        }
        const post = await Post.findById(req.params.id);

        if (post.status !== "published") {
            const error = new Error("Post not published");
            error.statusCode = 429;
            throw error;
        }

        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        const publishedPost = await Post.updateOne({ _id: req.params.id }, { $set: { status: "draft" } })
        res.status(200).json({
            success: true,
            message: "Post changed to draft successfully",
        })
    } catch (error) {
        next(error)
    }
}

export const deletePost = async (req, res, next) => {
    try {
        if (!req.params.id) {
            const error = new Error("Post ID is required");
            error.statusCode = 404;
            throw error;
        }

        const post = await Post.findById(req.params.id)

        if (!post) {
            const error = new Error("Post already deleted");
            error.statusCode = 404;
            throw error;
        }

        if (post.tags && post.tags.length > 0) {
            await Tag.updateMany(
                { _id: { $in: post.tags } },
                { $inc: { postsCount: -1 } },
                { $max: { postsCount: 0 } }
            )
        }

        await post.deleteOne({ _id: req.params.id })


        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })

    } catch (error) {
        next(error)
    }
}

export const likePost = async (req, res, next) => {
    try {
        if (!req.params.id) {
            const error = new Error("Post ID is required");
            error.statusCode = 404;
            throw error;
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        const existingLike = await Like.findOne({ user: req.user.id, post: req.params.id });

        // Like exists delete and decrement the like count
        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id })
            post.likesCount = Math.max(0, post.likesCount - 1)

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post unliked successfully"
            })
        }

        // Create new Like
        await Like.create({ user: req.user.id, post: req.params.id })

        post.likesCount += 1;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post liked successfully"
        })

    } catch (error) {
        next(error)
    }
}

export const getPostsByTag = async (req, res, next) => {
    try {
        if (!req.params.tagName) {
            const error = new Error("Tag name is required");
            error.statusCode = 404;
            throw error;
        }

        const tag = await Tag.findOne({ name: req.params.tagName })
        if (!tag) {
            const error = new Error("Tag not found");
            error.statusCode = 404;
            throw error;
        }

        const posts = await Post.find({ tags: tag._id, status: "published" }).select("-oldSlugs").populate("aurthor", "name profileImage followersCount").populate("tags", "name description").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "success",
            data: {
                tag: tag.name,
                post_length: posts.length,
                posts
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getMyPosts = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error("You are unauthorized to access this posts");
            error.statusCode = 401;
            throw error;
        }

        const posts = await Post.find({ aurthor: req.params.id, status: "published" }).select("-oldSlugs").populate("aurthor", "name profileImage followersCount").populate("tags", "name description").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "success",
            data: posts,
        })
    } catch (error) {
        next(error)
    }
}

export const getDraftPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ status: "draft" }).populate("aurthor", "name profileImage followersCount").populate("tags", "name description")

        if(!posts) {
            res.status(204).json({
                success: true,
                message: "No Post found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Post retrived successfully",
            data: posts
        })
    } catch (error) {
        next(error)
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params

        const post = await Post.findById(id)
        if (!post) {
            const error = new Error("Post not found")
            error.statusCode = 404
            throw error
        }

        // push the old slug into OldSlugs array and empty post and save the post
        if (req.body.title && req.body.title !== post.title) {
            post.title = req.body.title;
        }

        Object.keys(req.body).forEach((key) => {
            if (key !== "title" && key !== "slug") {
                post[key] = req.body[key]
            }
        })

        await post.save()

        res.status(200).json({
            success: true,
            message: "Post updated successfully"
        })
    } catch (error) {
        next(error)
    }
}